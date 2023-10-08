const url = 'https://jsonplaceholder.typicode.com/users';
//Fetch: api'lere istek atmamızı sağlar
fetch(url).then((response)=>{
    //olumlu cevap gelirse çalışır
    //gelen json verisini kullanılır hale getirir
    return response.json()
})
//veri işlendikten sonra çalışır
.then(renderUser)
//Olumsuz cevap gelirse çalışır
.catch((error)=>{
    console.log('Veri çekerken hata oluştu' + error);
})
function renderUser(data){
    data.forEach((user) => document.write(user.name+ "<br>") );
}