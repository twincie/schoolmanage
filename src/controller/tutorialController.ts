import { Request, Response } from "express";
import TutorialService from "../services/tutorialService";

export default class TutorialController {
  private tutorialService = new TutorialService();
  
  create = async (req: Request, res: Response) => {
    if (!req.body.title) {
      res.status(200).send({
        message: "Content can not be empty!"
      });
      return;
    }

    if (!req.body.description) {
      res.status(200).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const { title, description} = req.body;
      const savedTutorial = await this.tutorialService.createTutorial(title, description);
      if (!savedTutorial){
        res.status(200).send({status: "99", message: "Tutorial already exists."})
        return;
      }
      res.status(200).send({status: "00", message: "Tutorial succcessfully created.", data: savedTutorial});
    } catch (err) {
      console.log("[-] Error occured when creating tutorial : "+ err);
      res.status(200).send({ status: "99",
        message: "Some error occurred while creating tutorial."
      });
    }
  }

  findAll = async (req: Request, res: Response) => {
    try {
    const tutorials = await this.tutorialService.getallTutorial();
    res.status(200).send({
        status: "00", 
        message: "Tutorials gotten successfully", 
        data: tutorials
      });
    } catch (err) {
      res.status(200).send({
        status: "99",
        message: "Some error occurred while retrieving tutorials."
      });
    }
  }

  findOne = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      const tutorial = await this.tutorialService.findById(id);

      if (tutorial) res.status(200).send({
        status: "00", 
        message: "Tutorial gotten successfully.", 
        data:tutorial
      });
      else
        res.status(200).send({
          status: "99",
          message: `Cannot find Tutorial with id=${id}.`
        });
    } catch (err) {
      res.status(200).send({
        status: "99",
        message: `Error retrieving Tutorial with id=${id}.`
      });
    }
  }

  update = async (req: Request, res: Response) => {
    var id = parseInt(req.params.id);
    let { title,description } = req.body;
    try {
    
      const tutorial = await this.tutorialService.findById(id);
      if (tutorial == null){
        console.log("[-] id does not exist.")
        res.send({
          status: "01", 
          message: "id does not exist."
        });
        return;
      }

      tutorial.title = title;
      tutorial.description = description;
      const updatedTutorial = await this.tutorialService.updateTutorial(tutorial);

      if (!updatedTutorial) {
        res.send({
          status: "99",
          message: `Cannot update Tutorial with id=${id}.`
        });
      } else {
        res.send({
          status: "00",
          message: "Tutorial updated successfully.",
          data: updatedTutorial
        });
      }
    } catch (err) {
      res.status(200).send({
        status: "99",
        message: `Error updating Tutorial with id=${id}.`
      });
    }
  }

  findAllPublished = async (req: Request, res: Response) => {
    try {
    const tutorials = await this.tutorialService.getAllPublishedTutorials();
    res.status(200).send({
        status: "00", 
        message: "Published Tutorials gotten successfully", 
        data: tutorials
      });
    } catch (err) {
      res.status(200).send({
        status: "99",
        message: "Some error occurred while retrieving published tutorials."
      });
    }
  }

  findAllUnPublished = async (req: Request, res: Response) => {
    try {
    const tutorials = await this.tutorialService.getAllUnPublishedTutorials();
    res.status(200).send({
        status: "00", 
        message: "UnPublished Tutorials gotten successfully", 
        data: tutorials
      });
    } catch (err) {
      res.status(200).send({
        status: "99",
        message: "Some error occurred while retrieving UnPublished tutorials."
      });
    }
  }
}