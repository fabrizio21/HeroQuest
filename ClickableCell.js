class ClickableCell extends GameObject {
    constructor(config) {
        super(config);

        this.sprite = new Sprite({
          gameObject: this,
          src: "/images/cell-highlight.png",
          animations: {
            "idle"   : [ [0,0] ]
          },
          currentAnimation: "idle"
        });
        

        

      }
    
      update() {
      }
}