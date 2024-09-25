<!-- ABOUT THE PROJECT -->
## About The Project
 POS website for phone stores

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![MongoDB][MongoDB.com]][MongoDB-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]
* [![Nodejs][Nodejs.com]][Nodejs-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Software Development Principles, Patterns, and Practices
- `Model-View-Controller (MVC)`: The application follows the MVC architectural pattern, with the model representing the data, the view displaying the data, and the controller handling the user's input and updating the model and view accordingly.

## Code Structure
The code for the application is organized into the following packages:

- `Docs`: Contains the documentation of project.
- `date.`: Contains Json data.
- `Src`: Contains source code of this project.
<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

* MongoDB install: [MongoDB Engine](https://www.mongodb.com/try/download/community)

### Installation

1. Run Docker Engine
2. Clone the repo
   ```sh
   git clone https://gitlab.duthu.net/S52100086/project_nodejs.git
   ```
3. Enter workspace
   ```sh
   cd/src
   ```
4. Run `npm i`to install nodemodule
   ```sh
    npm i 
   ```
5. Run `npm start` to start Server
    ```sh
    npm start 
    ```
6. Import database: 
- Go to MongoDB Compass , then import data from `/data`  .

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
- Demo video: [Click](https://drive.google.com/drive/folders/15fVosyc4hXVKhC1-yLQqwvnw82pggXbg?usp=sharing)

After `Import database` access to:
* Account (username/password): 
  - Admin : `admin`/`admin`
* Web-app:
  - Admin page `http://localhost:3000/admin`
  - Staff  page: `http://localhost:3000/staff`

_For more examples, please refer to the [Documentation](https://gitlab.duthu.net/S52100086/project_nodejs)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# Project structure:
    
<!-- * `mysql`:
    *  `sql`: include `*.sql` file 
	* `data`: database 
* `www`: include source code -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Nodejs.org]: https://imgs.search.brave.com/zLEJWjVEV0R2jeAPEXiq9x2RBItEXNCazobjDEElspU/rs:fit:560:320:1/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9kL2Q5L05v/ZGUuanNfbG9nby5z/dmcvNjQwcHgtTm9k/ZS5qc19sb2dvLnN2/Zy5wbmc
[Nodejs-url]: https://nodejs.org/en

[Mongodb.com]: https://imgs.search.brave.com/oocj3K63PzJU3R2ImfJnrQc9UmrywsW6MHuEDerI4b8/rs:fit:560:320:1/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vdGh1bWIv/NS81YS9Nb25nb0RC/X0ZvcmVzLUdyZWVu/LnN2Zy81MTJweC1N/b25nb0RCX0ZvcmVz/LUdyZWVuLnN2Zy5w/bmc
[Mongodb-url]: https://www.mongodb.com/

[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
