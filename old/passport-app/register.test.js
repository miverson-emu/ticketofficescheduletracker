//EMPTY ENTRY
test("INCOMPLETE REGISTRATION: ALL", (['','','','']) => {
	request(app)
	  .post("/register")
	  .expect("Content-Type", /json/)
	  .expect({ error: "incomplete" })
  });
//   test("INCOMPLETE REGISTRATION: NAME", () => {
// 	request(app)
// 	  .post("/register")
// 	  .expect("Content-Type", /json/)
// 	  .expect({ error: "incomplete" })
//   });
//   test("INCOMPLETE REGISTRATION: EMAIL", () => {
// 	request(app)
// 	  .post("/register")
// 	  .expect("Content-Type", /json/)
// 	  .expect({ error: "incomplete" })
//   });
//   test("INCOMPLETE REGISTRATION: PASS1", () => {
// 	request(app)
// 	  .post("/register")
// 	  .expect("Content-Type", /json/)
// 	  .expect({ error: "incomplete" })
//   });
//   test("INCOMPLETE REGISTRATION: PASS2", () => {
// 	request(app)
// 	  .post("/register")
// 	  .expect("Content-Type", /json/)
// 	  .expect({ error: "incomplete" })
//   });

//MISMATCH PASS
test("index route works", () => {
	request(app)
	  .get("/register")
	  .expect("Content-Type", /json/)
	  .expect({ error: "incomplete" })
  });
//PASSWORD LENGTH
test("index route works", () => {
	request(app)
	  .get("/register")
	  .expect("Content-Type", /json/)
	  .expect({ error: "incomplete" })
  });

