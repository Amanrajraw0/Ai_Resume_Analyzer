declare module "pdfjs-dist/build/pdf.mjs" {
    export * from "pdfjs-dist/types/src/pdf";
    import * as pdfjsLib from "pdfjs-dist";
    export default pdfjsLib;
}

declare module "pdfjs-dist/build/pdf.worker.mjs?url" {
    const workerSrc: string;
    export default workerSrc;
}
