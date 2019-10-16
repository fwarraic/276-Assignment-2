function viewValues(attrib, id)
{
  var rangeSlider = document.getElementById(attrib, id);
  var rangeBullet = document.getElementById(id);

  function showSliderValue() {
    rangeBullet.innerHTML = rangeSlider.value;
  }
  rangeSlider.addEventListener("input", showSliderValue(), false);
}