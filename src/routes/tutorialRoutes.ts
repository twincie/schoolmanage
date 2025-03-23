// import { Router } from "express";
// import TutorialController from "../controller/tutorial.controller";

// class TutorialRoutes {
//   router = Router();
//   controller = new TutorialController();

//   constructor() {
//     this.intializeRoutes();
//   }

//   intializeRoutes() {
//     // Create a new Tutorial
//     // this.router.post("/", this.controller.create);

//     // // Retrieve all Tutorials
//     this.router.get("/", this.controller.findAll);

//     // // Retrieve all published Tutorials
//     // this.router.get("/published", this.controller.findAllPublished);

//     // // Retrieve a single Tutorial with id
//     // this.router.get("/:id", this.controller.findOne);

//     // // Update a Tutorial with id
//     // this.router.put("/:id", this.controller.update);

//     // // Delete a Tutorial with id
//     // this.router.delete("/:id", this.controller.delete);

//     // // Delete all Tutorials
//     // this.router.delete("/", this.controller.deleteAll);
//   }
// }

// export default new TutorialRoutes().router;

import { Router } from 'express';
import TutorialController from '../controller/tutorialController';

const router = Router();
const tutorialController = new TutorialController();

router.post('/create', tutorialController.create);
router.get('/all', tutorialController.findAll);
router.get('/one/:id', tutorialController.findOne);
router.post('/update/:id', tutorialController.update);
router.post('/all-published', tutorialController.findAllPublished);
router.post('/all-unpublished', tutorialController.findAllUnPublished);

export { router as tutorialRoutes };