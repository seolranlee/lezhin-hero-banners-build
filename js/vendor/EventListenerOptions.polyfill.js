jQuery.event.special.touch = {
  setup: function( _, ns, handle ) {
      this.addEventListener("touch", handle, {passive: true});
      return false
  }
};

jQuery.event.special.wheel = {
  setup: function( _, ns, handle ) {
      this.addEventListener("wheel", handle, {passive: true});
      return false
  }
};
