import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [lista, setLista] = useState([]) //la lista de tareas comienza como un array vacio
	const [tarea, setTarea] = useState("")

	const obtenerTareas = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/matib")
			
			if (response.status == 404) {
				// si el usuario no existe
				await crearUsuario()
				return
			}
			const data = await response.json()
			// console.log(data.todos)
			setLista(data.todos)
		} catch (error) {
			console.log(error)
		}
	}
	const crearUsuario = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/matib", {
				method: "POST",
				headers: { "Content-Type": "application/json" }
			})
			
			if (response.status == 201) {
				await obtenerTareas()
				return
			}
		} catch (error) {
			console.log(error)
		}
	}

	const agregarTarea = async (e) => {
		if (tarea == "") {
			alert("No se ingreso tarea")
		} else {
			try {
				const response = await fetch("https://playground.4geeks.com/todo/todos/matib", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						"label": tarea,
						"is_done": false
					})
				})
				
				if(response.status==201){
					await obtenerTareas()
					setTarea("")
					return
				}
			} catch (error) {
				console.log(error)
			}

		}
	}

	const eliminarTarea =async (id) => {
		try {
			const response = await fetch ("https://playground.4geeks.com/todo/todos/"+ id,{
				method: "DELETE",
					headers: { "Content-Type": "application/json" },
			})
			
			if(response.status==204){
				await obtenerTareas()
				
				return
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		obtenerTareas()
	}, []) // Se ejecuta una sola vez

	return (
		<div className="text-center container">
			<h1>To Do List</h1>
			<div className="d-flex justify-content-center m-3">


				<input
					className="form-control"
					type="text"
					value={tarea}
					onChange={(e) => setTarea(e.target.value)}
				/>
				<button
					className="btn btn-success"
					onClick={(e) => agregarTarea(e)}
				>
					Agregar Tarea
				</button>
			</div>
			<ul className="list-group">
				{lista.map((item, id) => (
					<li className="list-group-item" key={id}>
						{item.label}
						<button className="btn btn-outline-danger float-end icono"

							onClick={() => eliminarTarea(item.id)}
						>X</button>
					</li>
				))}
			</ul>
			<h4 className="mt-2">Tareas Pendientes: {lista.length}</h4>
		</div>

	);
};

export default Home;