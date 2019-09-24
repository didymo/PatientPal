
export class DeployedSurvey {

    name: string;
    id: string;

    DeployedSurvey(name: string, id: string) {
    	this.name = name;
    	this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setId(id: string): void {
        this.id = id;
    }


}
