export async function getPublicEvents() {
  const response = await fetch(
    "http://localhost/eventx/api/v1/discover-events"
  );

  const data = await response.json();
  return data;
}