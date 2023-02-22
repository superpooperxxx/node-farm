const replaceTemplate = (temp, data, placeholders) => {
  let output = temp;

  for (const [key, placeholder] of Object.entries(placeholders)) {
    const regex = new RegExp(`${placeholder}`, 'g');

    if (key === 'organic') {
      output = data[key] ? output.replace(regex, '') : output.replace(regex, 'not-organic');
    } else {
      output = output.replace(regex, data[key]);
    }

  }

  return output;
};

module.exports = { replaceTemplate };
