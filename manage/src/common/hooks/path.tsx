// import { useEffect } from "react";
import { useLocation } from 'react-router-dom'

export function getPath() {
  let location = useLocation()
  return location.pathname
}
