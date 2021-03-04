export function toObjectProps(props) {
  const result = {};

  Object.keys(props).forEach((key) => {
    result[key] = { value: props[key] };
  });

  return result;
}
