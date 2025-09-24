import {
  Layout,
  Select,
  Input,
  Form,
  Row,
  Col,
  Checkbox,
  DatePicker,
  Button,
  Radio,
} from "antd";
import "./App.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
  CloseOutlined,
  EditOutlined,
  GithubOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Search, TextArea } = Input;

function App() {
  const [form] = Form.useForm();
  const startDate = Form.useWatch("start", form);
  const [search, setSearch] = useState();
  const [filteredTaskCards, setFilteredTaskCards] = useState([]);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [priority, setPriority] = useState("all");
  const [completed, setCompleted] = useState("all");

  useEffect(() => {
    setFilteredTaskCards(
      localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks"))
        : []
    );
  }, []);

  useEffect(() => {
    const localData = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];

    const priorityFiltered = localData.filter((item) => {
      if (priority === "all") return true;
      return item.priotarization.toLowerCase() === priority;
    });

    const completedFiltered =
      completed !== "all"
        ? priorityFiltered.filter(
            (item) => item.completed == (completed !== true ? null : completed)
          )
        : priorityFiltered;

    const searchFiltered = search
      ? completedFiltered.filter((item) =>
          item.title?.toLowerCase().includes(search.toLowerCase())
        )
      : completedFiltered;

    setFilteredTaskCards(searchFiltered);
  }, [search, priority, completed, rerenderTrigger]);

  const generateId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const onFinish = (values) => {
    const previousState = JSON.parse(localStorage.getItem("tasks")) || [];
    const preparedValues = {
      ...values,
      start: dayjs(values.start).format("DD/MM/YYYY"),
      end: dayjs(values.end).format("DD/MM/YYYY"),
      completed: form.getFieldValue("completed")
        ? form.getFieldValue("completed")
        : false,
      id: generateId(),
    };

    const nesto = previousState
      ? [...previousState, preparedValues]
      : [preparedValues];

    const stringified = JSON.stringify(nesto);

    localStorage.setItem("tasks", stringified);
    setRerenderTrigger((prev) => !prev);
    setCreateTask(false);
    form.resetFields();
  };

  const onEdit = (values) => {
    const previousState = JSON.parse(localStorage.getItem("tasks")) || [];
    const preparedValues = {
      ...values,
      start: dayjs(values.start).format("DD/MM/YYYY"),
      end: dayjs(values.end).format("DD/MM/YYYY"),
      completed: form.getFieldValue("completed")
        ? form.getFieldValue("completed")
        : false,
    };
    console.log(preparedValues);
    const newData = previousState.map((item) =>
      item.id === preparedValues.id ? preparedValues : item
    );

    const stringified = JSON.stringify(newData);
    localStorage.setItem("tasks", stringified);
    setRerenderTrigger((prev) => !prev);
    setCreateTask(false);
    setEditMode(false);
    form.resetFields();
  };

  const handleOnSearch = (value) => {
    setSearch(value);
  };

  const handleHeadColor = (item) => {
    let color;
    if (item.priotarization == "High") {
      color = "bg-red-600 bg-opacity-95";
    }
    if (item.priotarization == "Medium") {
      color = "bg-orange-600 bg-opacity-90";
    }
    if (item.priotarization == "Low") {
      color = "bg-yellow-600 bg-opacity-90";
    }
    if (item.completed) {
      color = "bg-green-400";
    }
    return color;
  };

  const handleCompletedBttn = (completed) => {
    if (completed === true) {
      return "bg-green-600";
    } else {
      return "bg-white";
    }
  };

  return (
    <Layout className="h-screen overflow-y-hidden">
      <Header className="text-white text-2xl flex justify-center align-center h-fit m-0 p-5 font-bold bg-gray-800 fixed w-screen z-10">
        Student To-do List App
      </Header>
      <Content className="text-base bg-gray-800 w-full h-full mt-10">
        <div className="p-2 w-full h-full text-white pt-5 pr-0 pt-0 pb-0">
          {/* Create Task Form */}
          <div className="w-1/5 h-fit bg-white bg-opaciy-50 rounded-2xl p-5 m-5 fixed inset-x-14 hidden 2xl:block">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              className="w-full h-full flex flex-col justify-between"
              onFinish={(values) => {
                const handler = editMode ? onEdit : onFinish;
                return handler(values);
              }}
              autoComplete="off"
            >
              <Row gutter={[45, 45]} justify={"center"}>
                <Col span={16}>
                  <div className="text-center text-2xl tracking-wide font-bold">
                    {editMode ? "Edit Task" : "Create Task"}
                  </div>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl">ID:</span>}
                    name="id"
                    className="hidden"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl">Title:</span>}
                    name="title"
                    rules={[
                      { required: true, message: "Please fill the title" },
                    ]}
                  >
                    <Input placeholder="Market neccesseties"/>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl">Description:</span>}
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please fill the description",
                      },
                    ]}
                  >
                    <TextArea
                      minLength={3}
                      maxLength={100}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      placeholder="Fish, apples, snaks, drinks"
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className=" text-xl mb-2">Type:</span>}
                    name="type"
                    rules={[
                      { required: true, message: "Please select a type" },
                    ]}
                  >
                    <Radio.Group className="flex justify-between w-full">
                      <Radio
                        value="Personal"
                        className="scale-[1.5] transform origin-left text-xs"
                      >
                        Personal
                      </Radio>
                      <Radio
                        value="Work"
                        className="scale-[1.5] transform origin-left text-xs"
                      >
                        Work
                      </Radio>
                      <Radio
                        value="Other"
                        className="scale-[1.5] transform origin-left text-xs"
                      >
                        Other
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl mb-2">Complete:</span>}
                    name="completed"
                    valuePropName="checked"
                  >
                    <Checkbox className="scale-[1.5] transform origin-left text-xs">
                      Completed
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={
                      <span className=" text-xl mb-2">Priotarization:</span>
                    }
                    name={"priotarization"}
                    rules={[
                      {
                        required: true,
                        message: "Please select priotarization",
                      },
                    ]}
                  >
                    <Radio.Group className="flex justify-between w-full">
                      <Radio
                        value="High"
                        className="scale-[1.5] transform origin-left text-xs"
                      >
                        High
                      </Radio>
                      <Radio
                        value="Medium"
                        className="scale-[1.5] transform origin-left text-xs"
                      >
                        Medium
                      </Radio>
                      <Radio
                        value="Low"
                        className="scale-[1.5] transform origin-left text-xs"
                      >
                        Low
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="text-xl mb-2">Start:</span>}
                        name="start"
                        rules={[
                          {
                            required: true,
                            message: "Please select a start date",
                          },
                        ]}
                      >
                        <DatePicker className="mr-5" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className="text-xl mb-2">End:</span>}
                        name="end"
                        rules={[
                          {
                            required: true,
                            message: "Please select an end date",
                          },
                        ]}
                      >
                        <DatePicker
                          className="mr-5"
                          disabledDate={(current) =>
                            startDate
                              ? current.isBefore(dayjs(startDate), "day")
                              : false
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row justify={"end"} className="mt-5">
                <Button
                  className="mr-3"
                  type="primary"
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Reset fields
                </Button>
                <Button
                  type="primary"
                  className={editMode ? "mr-3" : "hidden"}
                  onClick={() => {
                    form.resetFields();
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editMode ? "Edit" : "Create"}
                </Button>
              </Row>
            </Form>
          </div>
          {/* End of Task Form */}
          {/* Search Filter */}
          <div className="flex flex-col lg:flex-row justify-start lg:justify-end w-full h-full mt-5 rounded-2xl overflow-hidden">
            {/* Slide-in Task Panel */}
            <div
              className={`w-screen bg-white block xl:hidden absolute top-0 left-0 z-10 transition-all duration-500 ease-in-out overflow-x-hidden ${
                createTask
                  ? "h-screen overflow-y-auto sm:overflow-hidden"
                  : "h-0 overflow-hidden"
              }`}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 bg-gray-800 text-white text-2xl font-bold flex items-center justify-center p-5">
                <CloseOutlined
                  className="mr-5"
                  onClick={() => setCreateTask((prev) => !prev)}
                />
                {editMode ? "Edit Task" : "Create Task"}
              </div>

              {/* Form Container */}
              <div className="bg-gray-800 flex justify-center items-center pb-5 md:pb-52 h-auto sm:h-full pr-2">
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={(values) => {
                    const handler = editMode ? onEdit : onFinish;
                    return handler(values);
                  }}
                  autoComplete="off"
                >
                  <Row gutter={[40, 40]} justify="center">
                    <Col xs={18} sm={18} md={16}>
                      <Form.Item
                        name={"title"}
                        label={
                          <span className="text-xl text-white">Title:</span>
                        }
                        required
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={18} sm={18} md={16}>
                      <Form.Item
                        name={"description"}
                        label={
                          <span className="text-xl text-white">
                            Description:
                          </span>
                        }
                        required
                      >
                        <TextArea
                          minLength={3}
                          maxLength={100}
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={18}>
                      <Form.Item
                        label={
                          <span className="text-xl mb-2 text-white">Type:</span>
                        }
                        name="type"
                        rules={[
                          { required: true, message: "Please select a type" },
                        ]}
                      >
                        <Radio.Group className="flex justify-between w-full">
                          <Radio
                            value="Personal"
                            className="scale-[1.5] transform origin-left text-xs text-white"
                          >
                            Personal
                          </Radio>
                          <Radio
                            value="Work"
                            className="scale-[1.5] transform origin-left text-xs text-white"
                          >
                            Work
                          </Radio>
                          <Radio
                            value="Other"
                            className="scale-[1.5] transform origin-left text-xs text-white"
                          >
                            Other
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={18}>
                      <Form.Item
                        label={
                          <span className="text-white text-xl mb-2">
                            Complete:
                          </span>
                        }
                        name="completed"
                        valuePropName="checked"
                      >
                        <Checkbox className="scale-[1.5] transform origin-left text-xs text-white">
                          Completed
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={18}>
                      <Form.Item
                        label={
                          <span className="text-white text-xl mb-2">
                            Priotarization:
                          </span>
                        }
                        name={"priotarization"}
                        rules={[
                          {
                            required: true,
                            message: "Please select priotarization",
                          },
                        ]}
                      >
                        <Radio.Group className="flex justify-between w-full">
                          <Radio
                            value="High"
                            className="scale-[1.5] transform origin-left text-xs text-white"
                          >
                            High
                          </Radio>
                          <Radio
                            value="Medium"
                            className="scale-[1.5] transform origin-left text-xs text-white"
                          >
                            Medium
                          </Radio>
                          <Radio
                            value="Low"
                            className="scale-[1.5] transform origin-left text-xs text-white"
                          >
                            Low
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={18}>
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="text-white text-xl mb-2">
                                Start:
                              </span>
                            }
                            name="start"
                            rules={[
                              {
                                required: true,
                                message: "Please select a start date",
                              },
                            ]}
                          >
                            <DatePicker className="mr-5" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="text-white text-xl mb-2">
                                End:
                              </span>
                            }
                            name="end"
                            rules={[
                              {
                                required: true,
                                message: "Please select an end date",
                              },
                            ]}
                          >
                            <DatePicker
                              className="mr-5"
                              disabledDate={(current) =>
                                startDate
                                  ? current.isBefore(dayjs(startDate), "day")
                                  : false
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    {/* Input Fields */}
                  </Row>

                  {/* Action Buttons */}
                  <Row justify={"end"} className="mt-5">
                    <Button
                      className="mr-3"
                      type="primary"
                      onClick={() => {
                        form.resetFields();
                      }}
                    >
                      Reset fields
                    </Button>
                    <Button
                      type="primary"
                      className={editMode ? "mr-3" : "hidden"}
                      onClick={() => {
                        form.resetFields();
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                      {editMode ? "Edit" : "Create"}
                    </Button>
                  </Row>
                </Form>
              </div>
            </div>

            <div className="w-full xl:w-3/4 h-full flex flex-col">
              <div
                className="w-full xl:px-5 block xl:hidden font-bold px-2"
                onClick={() => {
                  setCreateTask((prev) => !prev);
                }}
              >
                + Add Task
              </div>
              <div className="w-full mt-5 px-2 lg:px-5">
                <div className="w-full flex flex-wrap gap-4">
                  <Search
                    placeholder="Search..."
                    className="w-full lg:w-1/4"
                    enterButton
                    onSearch={handleOnSearch}
                    allowClear
                  />
                  <div className="w-full lg:w-1/4">
                    <Select
                      className="w-full"
                      placeholder="Select a category"
                      options={[
                        {
                          value: "high",
                          label: (
                            <div>
                              <span className="text-gray-500">
                                (Priotarization){" "}
                              </span>
                              High
                            </div>
                          ),
                        },
                        {
                          value: "medium",
                          label: (
                            <div>
                              <span className="text-gray-500">
                                (Priotarization){" "}
                              </span>
                              Medium
                            </div>
                          ),
                        },
                        {
                          value: "low",
                          label: (
                            <div>
                              <span className="text-gray-500">
                                (Priotarization){" "}
                              </span>
                              Low
                            </div>
                          ),
                        },
                        {
                          value: "all",
                          label: (
                            <div>
                              <span className="text-gray-500">
                                (Priotarization){" "}
                              </span>
                              All
                            </div>
                          ),
                        },
                      ]}
                      value={priority}
                      onChange={(value) => {
                        setPriority(value);
                      }}
                    />
                  </div>
                  <div className="w-full lg:w-1/4">
                    <Select
                      className="w-full"
                      placeholder="Select status"
                      options={[
                        {
                          value: "completed",
                          label: (
                            <div>
                              <span className="text-gray-500">(Status) </span>
                              Completed
                            </div>
                          ),
                        },
                        {
                          value: "active",
                          label: (
                            <div>
                              <span className="text-gray-500">(Status) </span>
                              Active
                            </div>
                          ),
                        },
                        {
                          value: "all",
                          label: (
                            <div>
                              <span className="text-gray-500">(Status) </span>
                              All
                            </div>
                          ),
                        },
                      ]}
                      value={completed}
                      onChange={(value) => {
                        setCompleted(value);
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* End of Search Filter */}
              {/* This can go into a separate component */}
              <div className="flex-1 overflow-y-auto mt-4 mb-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 pb-5 lg:pb-24 p-5 mt-5 ">
                  {/* Task Cards */}
                  {filteredTaskCards.map((item, index) => (
                    <div
                      className="bg-white h-40 shadow rounded flex text-black rounded-lg"
                      key={index}
                    >
                      <div className="w-full">
                        <div
                          className={`w-full p-2 ${handleHeadColor(
                            item
                          )} font-bold flex rounded-tr-lg rounded-tl-lg`}
                        >
                          <p className="word-break w-4/5 pl-2 text-gray-200">
                            {item.title}
                          </p>
                          <div className="w-1/5 flex justify-end items-center">
                            <div className="text-white mr-5">
                              <EditOutlined
                                onClick={() => {
                                  form.setFieldsValue({
                                    title: item.title,
                                    description: item.description,
                                    type: item.type,
                                    completed: item.completed,
                                    priotarization: item.priotarization,
                                    id: item.id,
                                    start: dayjs(item.start, "DD/MM/YYYY"),
                                    end: dayjs(item.end, "DD/MM/YYYY"),
                                  });
                                  setEditMode(true);
                                  setCreateTask((prev) => !prev);
                                }}
                              />
                            </div>
                            <div className="text-white mr-5">
                              <CloseOutlined
                                onClick={() => {
                                  const parsed =
                                    JSON.parse(localStorage.getItem("tasks")) ||
                                    [];
                                  const filtered = parsed.filter(
                                    (value) => value.id !== item.id
                                  );
                                  const stringified = JSON.stringify(filtered);
                                  localStorage.setItem("tasks", stringified);
                                  setRerenderTrigger((prev) => !prev);
                                }}
                              />
                            </div>
                            <div
                              className={`p-2 ${handleCompletedBttn(
                                item.completed
                              )} w-fit h-fit rounded-full`}
                              onClick={() => {
                                const data =
                                  JSON.parse(localStorage.getItem("tasks")) ||
                                  [];
                                const updatedData = data.map((entity) => {
                                  if (entity.id == item.id) {
                                    return {
                                      ...entity,
                                      completed:
                                        entity.completed === true
                                          ? false
                                          : true,
                                    };
                                  }
                                  return entity;
                                });
                                localStorage.setItem(
                                  "tasks",
                                  JSON.stringify(updatedData)
                                );
                                setRerenderTrigger((prev) => !prev);
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="p-1 px-2">
                          <div className="w-full font-bold flex justify-between">
                            <p>{item.type}</p>
                            <p>{item.completed ? "completed" : ""}</p>
                          </div>
                          <div className="w-full">
                            {item.start} - {item.end}
                          </div>
                          <div className="break-words whitespace-normal w-full">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* End of Task Cards */}
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer className="flex justify-center bg-gray-900 text-gray-300 hidden lg:sticky w-screen bottom-0">
        <div className="text-xl flex flex-col lg:flex-row justify-center lg:justify-between w-full">
          <div className="mr-5">© Made by Zvoosh</div>
          <div className="flex flex-col lg:flex-row">
            <div className="mr-5">
              <InstagramOutlined /> @KlasicanDan
            </div>
            <div className="mr-5">
              <GithubOutlined /> zvoosh
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
