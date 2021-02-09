export default class Zone { //make 6 of these
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(200, 150, 150, 150).setRectangleDropZone(150, 150);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderOutline = (dropZone) => { //change from an outline to the coasters
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff0000);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        }
    }
}