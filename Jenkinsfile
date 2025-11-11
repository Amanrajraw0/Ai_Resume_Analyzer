pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        EC2B_SSH = credentials('ec2b_ssh')
        DOCKER_IMAGE = "amanrajraw0/instantprachi-myapp"
        DEPLOY_SERVER = "16.171.173.38"
    }

    options {
        // Keep build console tidy & show timestamps
        timestamps()
        // Stop long stuck builds automatically
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo '📦 Cloning code from GitHub...'
                git branch: 'main', url: 'https://github.com/Amanrajraw0/Ai_Resume_Analyzer.git'
            }
        }

        stage('Build & Tag Docker Image (with cache)') {
            steps {
                echo '⚙️ Building Docker image efficiently...'
                sh '''
                # Pull previous image if exists to use cached layers
                docker pull ${DOCKER_IMAGE}:latest || true

                # Build with cache and optimized parallel layers
                docker build --pull --cache-from=${DOCKER_IMAGE}:latest -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing optimized image to Docker Hub...'
                sh '''
                echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Deploy to EC2-B') {
            steps {
                echo '🚀 Deploying to EC2-B...'
                sshagent (credentials: ['ec2b_ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${DEPLOY_SERVER} '
                        echo "🧹 Cleaning up old container..." &&
                        docker stop myapp || true &&
                        docker rm myapp || true &&
                        echo "📥 Pulling latest image..." &&
                        docker pull ${DOCKER_IMAGE}:latest &&
                        echo "▶️ Starting new container..." &&
                        docker run -d -p 80:3000 --name myapp ${DOCKER_IMAGE}:latest &&
                        echo "✅ Deployment complete!"
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! App deployed to EC2-B.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for errors.'
        }
    }
}
