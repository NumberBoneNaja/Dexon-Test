// api/infoApi.ts

import type { IInfo } from "../../interface/info"


const API_URL = "http://localhost:8000" // เปลี่ยนตาม backend ของคุณ

export async function getAllInfo(){
  try {
    const res = await fetch(`${API_URL}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Error fetching info: ${res.status}`)
    }

    const data = await res.json()
    console.log("data from getAllInfo:", data)
    return data
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function NewPipe(data: IInfo){
  try {
    const response = await fetch(`${API_URL}/info`, {
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
    console.log("data from getAllInfo:", responseData)
    return responseData
  } catch (err) {
    console.error(err)
    return null
  
  }
}

export async function EditPipeline(data: IInfo , id: number){
  try {
    const response = await fetch(`${API_URL}/info/${id}`, {
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
    console.log("data from getAllInfo:", responseData)
    return responseData
  } catch (err) {
    console.error(err)
    return null
  
  }
}

export async function getInfoByID(id: number){
  try {
    const res = await fetch(`${API_URL}/info/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Error fetching info: ${res.status}`)
    }

    const data = await res.json()
    console.log("data from getAllInfo:", data)
    return data
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function DeletePipe(id: number){
  try {
    const res = await fetch(`${API_URL}/info/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Error fetching info: ${res.status}`)
    }

    const data = await res.json()
    console.log("delete data:", data)
    return data
  } catch (err) {
    console.error(err)
    return false
  }
}