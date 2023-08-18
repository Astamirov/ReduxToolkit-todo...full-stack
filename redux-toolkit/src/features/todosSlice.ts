import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type Todo = {
    _id: string;
    text: string;
    completed: boolean;
    loading?: boolean;
}

type StateTodos = {
    todos: Todo[];
    error: string | null | unknown;
    loading: boolean;
}

const initialState: StateTodos = {
    todos: [],
    error: null,
    loading: false 
}


export const fetchTodo = createAsyncThunk<
    Todo[], 
    void, 
    {rejectValue: string}
    >('todos/fetchTodo', async (_, thunkAPI) => {
        try{
            const res = await fetch('http://localhost:3000/getTodo')
            const todo = await res.json();
            return thunkAPI.fulfillWithValue(todo);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
});

export const removeTodo = createAsyncThunk<
    string, 
    string, 
    {rejectValue: string}
    >('todos/removeTodo', async (id, thunkAPI) => {
        try{
            const res = await fetch(`http://localhost:3000/deleteTodo/${id}`, {
                method: 'DELETE',
            });
            if(res.ok) {
                return id;
            }
            const todo = await res.json()
            return thunkAPI.rejectWithValue(todo)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
});

export const addTodo = createAsyncThunk<
    Todo,
    string,
    {rejectValue: string}
>('todos/addTodo', async (data, thunkAPI) => {
    try {
        const res = await fetch('http://localhost:3000/postTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: data}),
        })
        const todo = await res.json();
        return thunkAPI.fulfillWithValue(todo);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message) 
    }
})

export const changeTodo = createAsyncThunk<
    Todo,
    {id:string; completed: boolean}
>('todos/patch', async ({id, completed}, thunkAPI) => {
    try{
        const res = await fetch(`http://localhost:3000/patchTodo/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({completed: !completed}),
        });
        const todo = await res.json();
        return todo
    } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    })



const todosSlice = createSlice({
    name: 'Todo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTodo.fulfilled, (state, action: PayloadAction<Todo[]>) => {
            state.todos = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(fetchTodo.rejected, (state, action: PayloadAction<string | unknown>) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(fetchTodo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeTodo.fulfilled, (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((todo) => todo._id !== action.payload)
            state.error = null;
        })
        .addCase(removeTodo.rejected, (state, action: PayloadAction<string | unknown>) => {
            state.error = action.payload;
        })
        .addCase(removeTodo.pending, (state, action: PayloadAction<void, string, {arg: string | unknown}>) => {
            state.todos = state.todos.map((todo) => {
                if(todo._id === action.meta.arg) {
                    todo.loading = true;
                }
                return todo;
            })
        })
        .addCase(addTodo.fulfilled, (state, action) => {
            state.todos.unshift(action.payload);
            state.loading = false, state.error = null
        })
        .addCase(addTodo.rejected, (state, action) => {
            state.loading = false, state.error = action.payload
        })
        .addCase(addTodo.pending, (state) => {
            state.loading = true, state.error = null
        })
        .addCase(changeTodo.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.todos = state.todos.map((todo) => {
                if(todo._id === action.payload._id) {
                    todo.completed = !todo.completed
                }
                return todo
            })
        })
        .addCase(changeTodo.rejected, (state, action) => {
            state.loading = false, state.error = action.payload
        })
        .addCase(changeTodo.pending, (state) => {
            state.loading = true, state.error = null
        })
    },
});


export default todosSlice.reducer