export const switchCanisterCollection = (currentValue,newValue) => {
    var curr_url = window.location.pathname;
    var formattedValue = newValue.toLowerCase().replace(/ /g, '-');
    var new_url = curr_url.replace(currentValue, formattedValue);
    console.log(new_url);
    return new_url;
}