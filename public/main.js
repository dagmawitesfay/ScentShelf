
 const deleteBtn = document.querySelectorAll(".delete");
const searchBar = document.querySelector("#search")
const perfumeContainer = document.querySelectorAll(".individual-perfume")

    // Not found message
 const notFoundContainer = document.createElement("div")
    notFoundContainer.classList.add("error-message")
    notFoundContainer.style.display = "none" 

      const message = document.createElement("p")
      message.classList.add("error")
      notFoundContainer.append(message)
      document.querySelector(".fragrance-collection-wrapper").append(notFoundContainer)



// search by brandName
searchBar.addEventListener("input",(event)=>{
  let match = 0 // for storing the error message
  const perfumeQuery = event.target.value.toLowerCase().trim()

  // loop through each cards
  perfumeContainer.forEach(card=>{
    // search term normalized
    const name  = card.querySelector("#perfume-name").textContent.toLowerCase()
    
    // show the matched brandName 
    if(name.includes(perfumeQuery)){
      card.style.display = ""
      match++
    } else{
        card.style.display = "none"
    }
  })

  // chedck the match count to display the error message card
  if(match===0){
      message.textContent = `Couldnt Found "${perfumeQuery}" please search again`
      notFoundContainer.style.display = ""
  } else{
    notFoundContainer.style.display = "none"
  }
})
deleteBtn.forEach(function(element) {

      element.addEventListener('click', function() {
          const id = element.dataset.perfumeId
         // build the confirm window for mistake deletion
          const confirmText = confirm("Delete the question ? It can be undone 🥸")
        if(confirmText){
        fetch('/perfume', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        }).then(function(response) {
          if (response.ok) {
          window.location.reload()
          }
        })
      }
      });
});
