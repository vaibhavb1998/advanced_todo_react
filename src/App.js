import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./components/Column";
import { Col, Form, FormControl, InputGroup, Container } from "react-bootstrap";
import "./App.css";

const TaskArea = styled.div`
  display: flex;
`;

const InnerList = (props) => {
  const { column, taskMap, index } = props;
  let taskCount = 0;
  const tasks = column.taskIds.map((taskId) => {
    if (taskMap[taskId].isVisible && !taskMap[taskId].isDeleted) {
      ++taskCount;
    }

    return taskMap[taskId];
  });

  return (
    <Column
      column={column}
      tasks={tasks}
      index={index}
      handlesubmit={props.handlesubmit}
      delete={props.delete}
      priorityFilter={props.priorityFilter}
      taskCount={taskCount}
    />
  );
};

const App = () => {
  const [state, setState] = useState({
    tasks: {},
    columns: {
      "column-1": {
        id: "column-1",
        title: "To do",
        taskIds: [],
      },
      "column-2": {
        id: "column-2",
        title: "In progress",
        taskIds: [],
      },
      "column-3": {
        id: "column-3",
        title: "Done",
        taskIds: [],
      },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
    tasksCount: 0,
    columnsCount: 3,
  });
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState([]);

  const onDragStart = (start, provided) => {
    provided.announce(
      `You have lifted the task in position ${start.source.index + 1}`
    );
  };

  const onDragUpdate = (update, provided) => {
    const message = update.destination
      ? `You have moved the task to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;

    provided.announce(message);
  };

  const onDragEnd = (result, provided) => {
    const message = result.destination
      ? `You have moved the task from position
          ${result.source.index + 1} to ${result.destination.index + 1}`
      : `The task has been returned to its starting position of
          ${result.source.index + 1}`;

    provided.announce(message);

    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // if (type === "column") {
    //   const newColumnOrder = Array.from(state.columnOrder);
    //   newColumnOrder.splice(source.index, 1);
    //   newColumnOrder.splice(destination.index, 0, draggableId);

    //   const newState = {
    //     ...state,
    //     columnOrder: newColumnOrder,
    //   };
    //   setState(newState);

    //   return;
    // }

    const home = state.columns[source.droppableId];
    const foreign = state.columns[destination.droppableId];

    if (home === foreign) {
      const newTaskIds = Array.from(home.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newHome = {
        ...home,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newHome.id]: newHome,
        },
      };

      setState(newState);

      return;
    }

    // moving from one list to another
    const homeTaskIds = Array.from(home.taskIds);
    homeTaskIds.splice(source.index, 1);
    const newHome = {
      ...home,
      taskIds: homeTaskIds,
    };

    const foreignTaskIds = Array.from(foreign.taskIds);
    foreignTaskIds.splice(destination.index, 0, draggableId);
    const newForeign = {
      ...foreign,
      taskIds: foreignTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newHome.id]: newHome,
        [newForeign.id]: newForeign,
      },
    };
    setState(newState);
  };

  const onAddNew = ({ title, description, priority, columnId }) => {
    const newTaskId = `task-${state.tasksCount + 1}`;

    const newState = {
      ...state,
      tasksCount: state.tasksCount + 1,
      tasks: {
        ...state.tasks,
        [newTaskId]: {
          id: newTaskId,
          title,
          description,
          priority,
          isVisible: true,
          isDeleted: false,
        },
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          taskIds: [...state.columns[columnId].taskIds, newTaskId],
        },
      },
    };

    setState(newState);
  };

  const onDelete = (event) => {
    const { taskid } = event.currentTarget.dataset;

    const tasksList = Object.values(state.tasks);

    const updatedTasks = tasksList.map((task) => {
      if (task.id === taskid) {
        task.isDeleted = true;
      }

      return task;
    });

    const newState = {
      ...state,
      task: updatedTasks,
    };

    setState(newState);
  };

  useEffect(() => {
    const filterList = () => {
      const tasksList = Object.values(state.tasks);

      const updatedTasks = tasksList.map((task) => {
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description.toLowerCase();
        const searchKey = search.toLowerCase();

        if (
          !taskTitle.includes(searchKey) &&
          !taskDescription.includes(searchKey)
        ) {
          task.isVisible = false;
        } else {
          task.isVisible = true;
        }

        return task;
      });

      const newState = {
        ...state,
        task: updatedTasks,
      };

      setState(newState);
    };

    filterList();
  }, [search]);

  return (
    <Container
      className="d-flex flex-column h-100"
      fluid
      style={{ backgroundColor: "rgba(240,255,240, 0.2)" }}
    >
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "20vh" }}
        fluid
      >
        <h1 style={{ fontWeight: 600, fontSize: 50 }}>Advanced TODO List</h1>
      </Container>
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <Container className="d-flex main-container" fluid>
              <Container className="d-flex mt-4 filter-container">
                <h3 style={{ fontWeight: 600 }}>Apply Filters</h3>
                <div className="mt-5 d-flex filters" style={{ width: "70%" }}>
                  <div className="d-flex search-filter-container">
                    <Form.Label as="legend" sm={2} htmlFor="search">
                      Search
                    </Form.Label>
                    <InputGroup className="search-filter">
                      <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        id="search"
                        placeholder="Search for title or description"
                      />
                    </InputGroup>
                  </div>

                  <Form.Group
                    className="mb-3 priority-filter-container"
                    onChange={(e) => {
                      const selectedPriority =
                        e.target.id === "lowPriority"
                          ? "low"
                          : e.target.id === "mediumPriority"
                          ? "medium"
                          : "high";

                      if (!priorityFilter.includes(selectedPriority)) {
                        setPriorityFilter([
                          ...priorityFilter,
                          selectedPriority,
                        ]);
                      } else {
                        const newPriorityFitler = [];

                        if (
                          priorityFilter.includes("low") &&
                          selectedPriority !== "low"
                        ) {
                          newPriorityFitler.push("low");
                        }
                        if (
                          priorityFilter.includes("medium") &&
                          selectedPriority !== "medium"
                        ) {
                          newPriorityFitler.push("medium");
                        }
                        if (
                          priorityFilter.includes("high") &&
                          selectedPriority !== "high"
                        ) {
                          newPriorityFitler.push("high");
                        }

                        setPriorityFilter(newPriorityFitler);
                      }
                    }}
                  >
                    <Form.Label as="legend" sm={2}>
                      Priority
                    </Form.Label>
                    <Col sm={10} className="priority-filter-items">
                      <Form.Check
                        type="checkbox"
                        label="Low"
                        name="formHorizontalRadios"
                        id="lowPriority"
                      />
                      <Form.Check
                        type="checkbox"
                        label="Medium"
                        name="formHorizontalRadios"
                        id="mediumPriority"
                      />
                      <Form.Check
                        type="checkbox"
                        label="High"
                        name="formHorizontalRadios"
                        id="highPriority"
                      />
                    </Col>
                  </Form.Group>
                </div>
              </Container>
              <TaskArea
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="container task-area"
              >
                {state.columnOrder.map((columnId, index) => {
                  const column = state.columns[columnId];
                  return (
                    <InnerList
                      key={column.id}
                      column={column}
                      taskMap={state.tasks}
                      index={index}
                      handlesubmit={onAddNew}
                      delete={onDelete}
                      priorityFilter={priorityFilter}
                    />
                  );
                })}
              </TaskArea>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default App;
