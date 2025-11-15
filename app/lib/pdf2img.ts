export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

// ✅ Load pdf.js once and cache it
async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib; // already loaded
    if (loadPromise) return loadPromise; // in-progress load

    if (typeof window === "undefined") {
        throw new Error("PDF.js can only be loaded in the browser environment");
    }

    isLoading = true;

    // Dynamically import both pdf.js core and worker file
    loadPromise = Promise.all([
        import("pdfjs-dist/build/pdf.mjs"),
        import("pdfjs-dist/build/pdf.worker.mjs?url"),
    ]).then(([lib, worker]) => {
        lib.GlobalWorkerOptions.workerSrc = worker.default;
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

// ✅ Convert a PDF into an image (only first page)
export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 3 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            (context as any).imageSmoothingQuality = "high";
        }

        await page.render({ canvasContext: context!, viewport }).promise;

        // Convert canvas to blob + File object
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const imageFile = new File(
                            [blob],
                            `${file.name.replace(/\.pdf$/i, "")}.png`,
                            { type: "image/png" }
                        );

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob from canvas",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        console.error("❌ PDF conversion failed:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${String(err)}`,
        };
    }
}
