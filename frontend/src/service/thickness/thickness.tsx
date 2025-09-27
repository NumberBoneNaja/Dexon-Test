import type { ITestpoint } from "../../interface/testpoint"
import type { IThickness } from "../../interface/thickness"

const API_URL = "http://localhost:8000" // เปลี่ยนตาม backend ของคุณ

export async function getThicknessBytestpoint(id : number){
  try {
    const res = await fetch(`${API_URL}/thickness/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Error fetching info: ${res.status}`)
    }

    const data = await res.json()
   
    return data
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function NewThickness(data: IThickness){
  try {
    const response = await fetch(`${API_URL}/thickness`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error fetching info: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("data from :", responseData)
    return responseData
  } catch (err) {
    console.error(err)
    return false
  
  }
}

export async function updateThickness(data: IThickness, id: number){
  try {
    const response = await fetch(`${API_URL}/thickness/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error fetching info: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("data from :", responseData)
    return responseData
  } catch (err) {
    console.error(err)
    return false
  
  }
}

export async function deletethickness(id: number){
  try {
    const response = await fetch(`${API_URL}/thickness/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching info: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("data from :", responseData)
    return responseData
  } catch (err) {
    console.error(err)
    return false
  }
}