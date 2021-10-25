var exports = {}

class Event{

}

class Worker{

}

//OBJECTS
class Hours {
	//MILITARY OR STANDARD?
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}
	
	toString(){
		return this.start + " - " + this.end
	}
	
	getTotalHours(){
		// return end - start;
	}

	parse(str){
		str.split(" - ");
		console.log(str.split(" - "))
	}
}

