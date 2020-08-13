jQuery.event.special.touchstart = {
  setup: function( _, ns, handle ) {
      this.addEventListener("touchstart", handle, {passive: true});
      return false
  }
};

jQuery.event.special.touchstart = {
  setup: function( _, ns, handle ) {
      this.addEventListener("touchmove", handle, {passive: true});
      return false
  }
};

jQuery.event.special.touchend = {
  setup: function( _, ns, handle ) {
      this.addEventListener("touchmove", handle, {passive: true});
      return false
  }
};

jQuery.event.special.touchend = {
  setup: function( _, ns, handle ) {
      this.addEventListener("touchmove", handle, {passive: true});
      return false
  }
};
