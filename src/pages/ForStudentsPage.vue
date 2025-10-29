import axios from 'axios' const myTodo = ref(0) async function loadTodoCount() { try { const base =
import.meta.env.DEV ? 'http://127.0.0.1:5001/teenager-mental-health-app/us-central1' :
'https://us-central1-teenager-mental-health-app.cloudfunctions.net' const url = `${base}/countTasks`
const { data } = await axios.get(url, { params: { status: 'todo', owner: currentUid() }, })
myTodo.value = data.count ?? 0 } catch (e) { console.error('Error counting tasks:', e) } }
