const addressBook = {
	list: "http://localhost:9000/api/addressbook/"
};

const entryClick = el => {
	console.log(el.dataset["lat"], el.dataset["lng"], el.id);
};

document.addEventListener("DOMContentLoaded", async () => {
	const elPeople = document.getElementById("people");

	const parent = document.createElement("span");

	const data = await fetch(addressBook.list);
	const dataJson = await data.json();

	dataJson.forEach(element => {
		console.log(element);
		const tEl = document.createElement("div");
		tEl.id = element.personId;
		if (element.latlng !== null) {
			tEl.dataset["lat"] = element.latlng.coordinates[0];
			tEl.dataset["lng"] = element.latlng.coordinates[1];
		}
		tEl.classList.add("person");

		const name = document.createElement("div");
		name.classList.add("name");
		name.innerHTML = element.last + ", " + element.first;
		tEl.appendChild(name);

		const phone = document.createElement("div");
		phone.classList.add("phone");
		phone.innerHTML = element.phone;
		tEl.appendChild(phone);

		const address = document.createElement("div");
		address.classList.add("address");

		const addrElements = ["street", "city", "province", "country", "postal"];
		addrElements.forEach(e => {
			if (element[e] !== undefined) {
				const el = document.createElement("div");
				el.classList.add(e);
				el.innerHTML = element[e];
				address.appendChild(el);
			}
		});

		tEl.appendChild(address);

		tEl.addEventListener("click", () => {
			entryClick(tEl);
		});

		parent.appendChild(tEl);
	});

	elPeople.appendChild(parent);
});
