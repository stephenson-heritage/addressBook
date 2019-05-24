const addressBook = {
	list: "http://localhost:9000/api/addressbook/"
};

document.addEventListener("DOMContentLoaded", async () => {
	const elPeople = document.getElementById("people");

	const data = await fetch(addressBook.list);
	const dataJson = await data.json();

	dataJson.forEach(element => {
		const tEl = document.createElement("div");
		tEl.innerHTML = element.first + " " + element.last;
		elPeople.appendChild(tEl);
	});
});
