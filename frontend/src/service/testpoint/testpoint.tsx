import type { ITestpoint } from "../../interface/testpoint"

const API_URL = "http://localhost:8000" // เปลี่ยนตาม backend ของคุณ

export async function getTestPointByCML(id : number){
  try {
    const res = await fetch(`${API_URL}/testpoint/${id}`, {
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

export async function NewTestPoint(data: ITestpoint){
  try {
    const response = await fetch(`${API_URL}/testpoint`, {
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

export async function updateTestPoint(data: ITestpoint, id: number){
  try {
    const response = await fetch(`${API_URL}/testpoint/${id}`, {
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

export async function deleteTestPoint(id: number){
  try {
    const response = await fetch(`${API_URL}/testpoint/${id}`, {
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