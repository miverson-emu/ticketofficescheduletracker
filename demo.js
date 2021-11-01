
function demoSelected() {
	const searchParams = new URLSearchParams(window.location.search)

	if (searchParams.has("demo")){
		d = getDemo(searchParams.get("demo"))
		return d.then((demo) => {
			console.log(demo)

			demo.content.forEach((demoContent) => {
				addTab(demoContent)
			})

			document.title = "EMU Ticket Office Scheduler Demo " + demo.id
			document.getElementById("title").innerHTML = document.title

			demoDisplay = [...document.getElementsByTagName("view")][0]
			demoDisplay.style.display = "flex";

			demoSelectDisplay = [...document.getElementsByTagName("demounselected")][0]
			demoSelectDisplay.style.display = "none";
			return true
		})
	
	}
	else {
		//populate selector
		return getDemos()
		.then((demos) => {
			selector = document.getElementById("demoSelector")

			demos.forEach((demo) => {
				selector.innerHTML+=selectorOption(demo.id, "Demo " + demo.id)
			}) 
		})
		.then(() => {
			return false
		})

		//add event listener
	}
}

function showDemo(){
	window.location.href = "?demo=" + document.getElementById("demoSelector").value
}


function selectorOption(value, display){
	return "<option value = \"" + value + "\">" + display + "</option>"
}

function getDemo(demoID) {
	return getDemos().then((demos) => {
		return demos.find(demo => demo.id == demoID)
	})
}

function getDemos(){
	return $.getJSON("demos.json")
}

function addTab(demoContent) {
	contentID = demoContent.title.replace(" ", "").toLowerCase()

	const tabContainer = [...document.getElementsByTagName("tabs")][0]
	tabContainer.innerHTML+= tab(demoContent.title, contentID)

	const contentElement = [...document.getElementsByTagName("content")][0]
	contentElement.innerHTML+=content(demoContent.bodyTitle, demoContent.text, demoContent.media, contentID, contentID + "-parent")
}

function tab(title, contentID) {
	return "<button id = \"" + (contentID + "-parent") + "\" onclick = \"show('" + contentID + "', this)\">" + title  + "</button>";
}

function content(title, text, src, contentID, parentID) {
	return "<div id = " + contentID + " parent = \"" + parentID + "\"class = 'tab-content'>" +
	 "<div>" + 
	"<contentTitle>"+ title + "</contentTitle>" + 
	"<p>" + text + "</p>" + 
	"</div>" + 
	(src ? "<video controls src = \"/ticketofficescheduletracker" + src + "\" ></video>" : "") + ""
	"</div>"
}

function show(id, elm){
	//show content
	const contentElement = [...document.getElementsByTagName("content")][0]
	const contentChildren = [...contentElement.children]
	currentlyDisplayedContent = contentChildren.find(child => child.style.display == "flex");

	if(currentlyDisplayedContent) {
		currentlyDisplayedContent.style.display = "none";
		document.getElementById(currentlyDisplayedContent.getAttribute("parent")).style.backgroundColor = "inherit"
	}
	elm.style.backgroundColor = "rgb(248,248,255)";
	document.getElementById(id).style.display = "flex"

}


window.onload = () => {
	demoSelected().then((selected) => {
		if(selected) {
			const firstTab = [...[... document.getElementsByTagName("tabs")][0].children][0];
			firstTab.click()
		}
	});
}