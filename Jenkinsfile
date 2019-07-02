node {
  def nodeHome = tool name: 'nodejs-dubnium', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'

  env.PATH = "${nodeHome}/bin:${env.PATH}"

  stage('Checkout') {
    checkout scm
  }

  stage('Install') {
    sh 'yarn'
  }

  stage('Lint') {
    sh 'yarn run lint'
  }
}
