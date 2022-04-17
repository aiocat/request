// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


let queryParametersDiv: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>("#query-parameters");
let createQueryParameterButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#add-query");

// create query parameter
createQueryParameterButton!.onclick = (): void => {
  let queryParameter: HTMLDivElement = document.createElement("div");
  queryParameter.className = "header";

  let container: HTMLSpanElement = document.createElement("span");

  let queryParameterKey: HTMLInputElement = document.createElement("input");
  queryParameterKey.type = "text";
  queryParameterKey.name = "key";
  queryParameterKey.placeholder = "Key";

  let queryParameterValue: HTMLInputElement = document.createElement("input");
  queryParameterValue.type = "text";
  queryParameterValue.name = "value";
  queryParameterValue.placeholder = "Value";

  let queryParameterDeleter: HTMLButtonElement = document.createElement("button");
  queryParameterDeleter.onclick = () => queryParameter.remove();
  queryParameterDeleter.innerText = "Delete";

  container.appendChild(queryParameterKey);
  container.appendChild(queryParameterValue);

  queryParameter.appendChild(container);
  queryParameter.appendChild(queryParameterDeleter);

  queryParametersDiv!.appendChild(queryParameter);
};
