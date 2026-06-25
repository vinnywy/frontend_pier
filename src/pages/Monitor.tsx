import DroneStream from "../components/DroneStream";

export default function Monitor() {
  return (
    <DroneStream
      gatewayId="7"
      apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
    />
  )
}
