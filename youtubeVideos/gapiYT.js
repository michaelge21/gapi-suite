const body = document.body;
const main = document.createElement('main');
body.appendChild(main);

const queryInput = document.querySelector('#searchQuery');
const numOfResults = document.querySelector('#numOfResults');
const submitButton = document.querySelector('#submit');

window.addEventListener("load", () => {
    loadClient();
});

submitButton.addEventListener('click', () => {
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  const inputText = queryInput.value; 
  const numberOfResults = numOfResults.value;

  queryInput.value = "";
  execute(inputText, numberOfResults);
});

function authenticate() {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
      .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyDUiYLei1rxFzco-KI65ZS9I1oqkRlyPqs");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(searchQuery, numResults) {
  return gapi.client.youtube.search.list({
    "part": [
      "snippet"
    ],
    "maxResults": numResults,
    "q": searchQuery
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response is: ", response);

              const arrayOfResults = response.result.items;

              for (item of arrayOfResults) {
                const newArticle = document.createElement('article');
                const title = document.createElement('h2');
                const img = new Image();
                const description = document.createElement('p');

                title.textContent = item.snippet.title;

                if (item.id.kind == "youtube#channel") {
                    img.src = item.snippet.thumbnails.medium.url;
                } else {
                    img.src = item.snippet.thumbnails.high.url;
                }

                description.textContent = item.snippet.description;
                
                newArticle.appendChild(title);
                newArticle.appendChild(img);
                newArticle.appendChild(description);

                main.appendChild(newArticle);
              }
            },
            function(err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "824599814190-k25otr5s5olem11reodjb4fuatd7cpbv.apps.googleusercontent.com"});
});


