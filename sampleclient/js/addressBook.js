mapboxgl.accessToken =
	"pk.eyJ1Ijoic3RlcGhlbnNvbi1oZXJpdGFnZSIsImEiOiJjanZ4ejlxazMwYWRlNDhrOHJxN2hlZGl5In0.GvwpDRkNHQKPfS8S2SA4Dg";

const mapboxStyle =
	"mapbox://styles/stephenson-heritage/cjw6lp2dl00yy1cs5gpqzbikd";

const addressBook = {
	list: "http://localhost:9000/api/addressbook/",
	add: "http://localhost:9000/api/addressbook/addAddress/"
};

const toggleAddDialog = show => {
	document.getElementById("addEntry").style.display = show ? "block" : "none";
};

const initMap = container => {
	const map = new mapboxgl.Map({
		container: container,
		style: mapboxStyle,
		center: [-121.657481, 37.440222],
		zoom: 16.5
	});
	return map;
};

const entryClick = (map, el) => {
	//console.log(el.dataset["lat"], el.dataset["lng"], el.id);
	if (el.dataset["lat"] !== undefined && el.dataset["lng"] !== undefined) {
		map.easeTo({ center: [el.dataset["lng"], el.dataset["lat"]] });
	}
};

document.addEventListener("DOMContentLoaded", async () => {
	// get container for addresses
	const elPeople = document.getElementById("people");
	// el to optimize rendering
	const parent = document.createElement("span");

	// a button on the entry form to save entry
	const btnAddEntryEl = document.getElementById("btnEntryFormAdd");

	let map = initMap("map");
	let markers = [];

	const mapEl = document.getElementById("map");

	btnAddEntryEl.addEventListener("click", async () => {
		let formEls = document.querySelectorAll(
			"#entryFormForm input[type='text']"
		);

		let postData = {};
		for (let i = 0; i < formEls.length; i++) {
			if (formEls[i].value.trim() !== "") {
				postData[formEls[i].name] = formEls[i].value;
			}
		}

		const data = await fetch(addressBook.add, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(postData)
		});
		await data.json();

		toggleAddDialog(false);
	});

	const data = await fetch(addressBook.list);
	const dataJson = await data.json();

	dataJson.forEach(element => {
		//console.log(element);

		if (element.latlng) {
			let tmpMarker = new mapboxgl.Marker()
				.setLngLat([
					element.latlng.coordinates[1],
					element.latlng.coordinates[0]
				])
				.addTo(map);
			markers.push(tmpMarker);
		}
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
			entryClick(map, tEl);
		});

		parent.appendChild(tEl);
	});

	elPeople.appendChild(parent);
});
