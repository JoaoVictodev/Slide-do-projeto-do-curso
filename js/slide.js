export default class Slide{
  constructor(slide, wrapper){
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {finalPosition: 0, startX: 0, movement: 0}
  }

  transition(active){
    this.slide.style.transition = active ? 'transform: .3s' : '';
  }

  moveSlide(distX){
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  uptadePosition(clientX){
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event){
    let moveType
    if(event.type === 'mousedown'){
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = 'mousemove'
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = 'touchmove';
    }
    this.wrapper.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  onMove(event){
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
    const finalPosition = this.uptadePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event){
  const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
  this.wrapper.removeEventListener(movetype, this.onMove);
  this.dist.finalPosition = this.dist.movePosition;
  this.transition(true);
  this.changeSlideOnEnd();
  }

  changeSlideOnEnd(){
    if(this.dist.movement > 120 && this.index.next !== undefined){
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.next !== undefined){
      this.activePrevSlide();
    } else{
      this.changedSlide(this.index.active);
    }
  }

  addSlideEvent(){
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvents(){
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Slides config

  slidePosition(slide){
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin)
  }

  slidesConfig(){
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {position, element}
    })
  }

  slidesIndexNav(index){
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined :  index + 1
    }
  }

  changedSlide(index){
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
  }

  activePrevSlide(){
    if(this.index.prev !== undefined) this.changedSlide(this.index.prev)
  }

  activeNextSlide(){
    if(this.index.next !== undefined) this.changedSlide(this.index.next)
  }

  init(){
    this.bindEvents();
    this.transition(true);
    this.addSlideEvent();
    this.slidesConfig();
    return this
  }
}