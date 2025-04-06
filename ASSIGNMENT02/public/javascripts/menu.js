const open_lateral_menu = () => {
  event.stopPropagation();
  const menu = document.getElementById('responsive-menu');
  if(menu.classList[0] == 'aside-hidden') {
    menu.classList = 'slide-left';
  }
}