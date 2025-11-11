pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')   // Jenkins Credential ID
        DOCKER_IMAGE = "amanrajraw0/instantprachi"    // Docker Hub Repo
        GIT_REPO = "https://github.com/Amanrajraw0/Ai_Resume_Analyzer.git" // Your GitHub repo
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo '📦 Pulling code from GitHub...'
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building optimized Docker image...'
                sh '''
                docker build -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing image to Docker Hub...'
                sh '''
                echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Image pushed to Docker Hub.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for errors.'
        }
    }
}
