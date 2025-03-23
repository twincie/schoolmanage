import { AppDataSource } from "../config/ormconfig";
import Tutorial from "../entity/tutorial";


export default class TutorialService {
    private tutorialRepository = () => {
        const connection = AppDataSource;
        return connection.getRepository(Tutorial);
    }

    async createTutorial(title: string, description: string): Promise<Tutorial | null> {
        const tutorialRepository = this.tutorialRepository();
        const existingTutorial = await tutorialRepository.findOne({ where: [{title}]});
        if (existingTutorial){
            console.log("[-] Tutorial already exists");
            return null;
        }
        const newTutorial = tutorialRepository.create({ title, description })
        return await tutorialRepository.save(newTutorial);
    }

    async getallTutorial() {
        const tutorialRepository = this.tutorialRepository();
        const existingTutorial = await tutorialRepository.find();
        return existingTutorial;
      }

    async findById(id: number): Promise<Tutorial | null>{
        const tutorialRepository = this.tutorialRepository();
        const existingTutorial = await tutorialRepository.findOneBy({id: id});
        return existingTutorial;
    }

    async updateTutorial(tutorial: Tutorial): Promise<Tutorial | null> {
        const tutorialRepository = this.tutorialRepository();
        const updates = await tutorialRepository.update(tutorial.id, tutorial);
        const updatedTutorial = await tutorialRepository.findOne({ where: { id: tutorial.id } });
        return updatedTutorial;
    }

    async getAllPublishedTutorials() {
        const tutorialRepository = this.tutorialRepository();
        const existingTutorial = await tutorialRepository.findBy({ published: true });
        return existingTutorial;
    }

    async getAllUnPublishedTutorials() {
        const tutorialRepository = this.tutorialRepository();
        const existingTutorial = await tutorialRepository.find({
            where: { published: false }
        });
        return existingTutorial;
    }

}

