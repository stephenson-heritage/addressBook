// eslint-disable-next-line no-undef
mapboxgl.accessToken =
	"pk.eyJ1Ijoic3RlcGhlbnNvbi1oZXJpdGFnZSIsImEiOiJjanZ4ejlxazMwYWRlNDhrOHJxN2hlZGl5In0.GvwpDRkNHQKPfS8S2SA4Dg";

const mapboxStyle =
	"mapbox://styles/stephenson-heritage/cjw6lp2dl00yy1cs5gpqzbikd";

const addressBook = {
	list: "http://localhost:9000/api/addressbook/",
	add: "http://localhost:9000/api/addressbook/addAddress/",
	del: id => "http://localhost:9000/api/addressbook/deleteAddress/" + id
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
		map.flyTo({
			center: [el.dataset["lng"], el.dataset["lat"]],
			speed: 0.7,
			curve: 1.2
		});
	}
};

let loadingEl = null;
let loadCount = 0;
const load = tick => {
	loadCount += tick;

	if (loadingEl !== null) {
		if (loadCount <= 0) {
			loadingEl.style.display = "none";
		} else {
			loadingEl.style.display = "block";
		}
	}
};

document.addEventListener("DOMContentLoaded", async () => {
	// get container for addresses
	const elPeople = document.getElementById("people");
	// el to optimize rendering
	const parent = document.createElement("span");
	loadingEl = document.getElementById("loading");
	// a button on the entry form to save entry
	const btnAddEntryEl = document.getElementById("btnEntryFormAdd");

	let map = initMap("map");
	let markers = [];

	const mapEl = document.getElementById("map");

	mapEl.addEventListener("mouseenter", () => {
		mapEl.style.width = "90vw";
		mapEl.style.height = "80vh";
		map.resize();
	});

	mapEl.addEventListener("mouseleave", () => {
		mapEl.style.width = "30vw";
		mapEl.style.height = "40vh";
		map.resize();
	});

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
		load(1);
		const data = await fetch(addressBook.add, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(postData)
		});
		await data.json();
		load(-1);
		toggleAddDialog(false);
		loadAddressBook();
	});

	const loadAddressBook = async () => {
		load(1);
		const data = await fetch(addressBook.list);
		data.json().then(dataJson => {
			load(-1);
			parent.innerHTML = "";
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

				const del = document.createElement("div");
				del.innerHTML = "<button>&#x1f5d1;</button>";
				del.classList.add("delete");
				del.addEventListener("click", async () => {
					const delURI = addressBook.del(del.parentElement.id);
					load(1);
					const response = await fetch(delURI);
					await response.json();
					load(-1);

					loadAddressBook();
				});

				tEl.appendChild(del);

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

				const addrElements = [
					"street",
					"city",
					"province",
					"country",
					"postal"
				];
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
	};

	loadAddressBook();
});
