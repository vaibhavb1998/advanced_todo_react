import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CustomModal = (props) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    priority: "low",
    columnId: props.selectedColumn,
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          props.handlesubmit(formValues);
          props.onHide();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create a New Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 360, overflowY: "auto" }}>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter a Title"
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
              maxLength={40}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              placeholder="Enter some description ..."
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              maxLength={200}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicRadio">
            <Form.Label column sm="2">
              Priority
            </Form.Label>
            {/* <Form.Control required /> */}
            <Form.Check
              required
              inline
              label="Low"
              name="group1"
              type="radio"
              id="low"
              checked={formValues.priority === "low" ? true : false}
              onChange={(e) =>
                setFormValues({ ...formValues, priority: e.target.id })
              }
            />
            <Form.Check
              inline
              label="Medium"
              name="group1"
              type="radio"
              id="medium"
              checked={formValues.priority === "medium" ? true : false}
              onChange={(e) =>
                setFormValues({ ...formValues, priority: e.target.id })
              }
            />
            <Form.Check
              inline
              label="High"
              name="group1"
              type="radio"
              id="high"
              checked={formValues.priority === "high" ? true : false}
              onChange={(e) =>
                setFormValues({ ...formValues, priority: e.target.id })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ width: 120 }}
            onClick={() => {
              props.onHide();
            }}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            style={{ width: 120 }}
            type="submit"
            size="lg"
          >
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CustomModal;
