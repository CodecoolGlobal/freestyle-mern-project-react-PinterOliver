# Stack-overflow project

This project is a full-stack book webshop, built with the MERN stack.
The project's main features include browsing, filtering, sorting, and adding books to a shopping cart, making orders, and following the status of the packages.
It has a unique feature for role-based authentication as well, ensuring secure access to different user roles.
During this project, we mostly used pair programming to make the best out of our collaboration.

# Table of Contents

    Installation
    Contribution
    Authors

# Installation

Before installing the project, make sure you have Docker installed on your machine.
Docker can be downloaded and installed from the official Docker website. Here are the links to download Docker for different operating systems:

[Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

[Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)

[Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)


After downloading and installing Docker, follow these steps to install and run the project:

Clone the repository to your local machine.

Navigate to the root/server directory of the project.

Run the entrypoint.sh script with three arguments: mongodb connection string and port(suggest to use 8080). Replace mongodb connection string and port with your desired values:

    ./entrypoint.sh <mongodb connection string> <port(suggest to use 8080)>

Finally, start the Docker containers using Docker Compose. From the root directory of the project, run:

    docker-compose up

This will build and start the Docker containers defined in the docker-compose.yml file.

Please note that the frontend and backend are not fully connected yet as the project is still under development.

# Contribution

If you'd like to contribute to the project, please follow these guidelines:

- Fork the repository.
- Create a new branch for your feature: git checkout -b feature-name.
- Make your changes and commit: git commit -m 'Add some feature'.
- Push to your fork: git push origin feature-name.
- Open a pull request.

# Authors

List of the contributors to the project:

<a href="https://github.com/CodecoolGlobal/freestyle-mern-project-react-PinterOliver/graphs/contributors">
 <img src="https://contrib.rocks/image?repo=CodecoolGlobal/freestyle-mern-project-react-PinterOliver" />
</a>