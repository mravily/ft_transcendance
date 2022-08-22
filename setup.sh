
# Installation de Docker
# installDocker() {
# 	if [![ command -v Docker &> /dev/null ]]
# 	then
# 		if [[ "$OSTYPE" == "linux-gnu"* ]]; then
# 			echo 'Linux';
# 			command sudo apt-get update
# 			command sudo apt-get install ./docker-desktop-<version>-<arch>.deb
# 		elif [[ "$OSTYPE" == "darwin"* ]]; then
# 			echo 'Mac'
# 			command brew install --cask docker
# 		fi
# 	else
# 		echo 'Docker is already install'
# 	fi
# }

if ! command nvm --version
then
	echo 'NVM is already install'
else
	command curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
fi
