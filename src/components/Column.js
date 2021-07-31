import React, { useState } from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import Button from "react-bootstrap/Button";
import CustomModal from "./CustomModal";

const Container = styled.div`
  margin: 8px;
  background-color: white;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h3`
  padding: 16px 20px;
  background-color: #f5f9fa;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "#E3FBEF" : "#F5F9FA"};
  flex-grow: 1;
  max-height: 80%;
  overflow: auto;
`;

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.tasks === this.props.tasks) {
      return false;
    }
    return true;
  }

  render() {
    return this.props.tasks.map(
      (task, index) =>
        task.isVisible &&
        !task.isDeleted &&
        (!this.props.priorityFilter.length ||
          this.props.priorityFilter.includes(task.priority)) && (
          <Task
            key={task.id}
            task={task}
            index={index}
            delete={this.props.delete}
          />
        )
    );
  }
}

const Column = (props) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable draggableId={props.column.id} index={props.index} isDragDisabled={true}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="column-container"
        >
          <Title
            {...provided.dragHandleProps}
            className="d-flex justify-content-between align-items-center mb-0"
          >
            <span>{props.column.title}</span>
            <span
              style={{
                color: "#90C2BA",
                minWidth: 35,
                borderRadius: 5,
                backgroundColor: "#E9F3F2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 0,
              }}
            >
              {props.taskCount}
            </span>
          </Title>
          <Droppable droppableId={props.column.id} type="task">
            {(provided, snapshot) => {
              return (
                <>
                  <div
                    style={{
                      width: "100%",
                      padding: "0 20px",
                      backgroundColor: "#f5f9fa",
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => {
                        setModalShow(true);
                      }}
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        backgroundColor: "#E8F2F1",
                        padding: "0px 10px",
                        color: "#86C5BA",
                        height: "40px",
                        width: "100%",
                        border: "1px solid #86C5BA",
                        borderStyle: "dashed",
                        marginBottom: "20px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                      </svg>
                    </Button>
                  </div>
                  <CustomModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    handlesubmit={props.handlesubmit}
                    selectedColumn={props.column.id}
                  />
                  <TaskList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    style={{ padding: "0 20px" }}
                  >
                    <InnerList
                      tasks={props.tasks}
                      delete={props.delete}
                      priorityFilter={props.priorityFilter}
                    />
                    {provided.placeholder}
                  </TaskList>
                </>
              );
            }}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
