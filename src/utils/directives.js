const focus = {
    inserted: function(el) {
        el.children[0].focus()
    }
}
const theme = {
    inserted: function(el, binding) {
        el.style.background = binding.value.background
    }
}
export {
    focus,
    theme
}