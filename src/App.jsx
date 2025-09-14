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
} from "antd";
import "./App.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { GithubOutlined, InstagramOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { Search, TextArea } = Input;

const { RangePicker } = DatePicker;

function App() {
  const [form] = Form.useForm();
  const [search, setSearch] = useState();
  const [filteredTaskCards, setFilteredTaskCards] = useState([]);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);
  const [typeSelected, setTypeSelected] = useState("");
  const [prioSelected, setPrioSelected] = useState("");
  const [priority, setPriority] = useState("high");
  const [checkboxes, setCheckboxes] = useState({
    type: null,
    priotarization: null,
    completed: null,
  });

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

    const searchFiltered = search
      ? priorityFiltered.filter((item) =>
          item.title?.toLowerCase().includes(search.toLowerCase())
        )
      : priorityFiltered;

    setFilteredTaskCards(searchFiltered);
  }, [search, priority, rerenderTrigger]);

  const handleCheckboxChange = (value) => {
    if (value == "Personal" || value == "Work" || value == "Other") {
      setTypeSelected((prev) => (prev === value ? null : value));
      setCheckboxes((prev) => ({
        ...prev,
        type: prev["type"] === value ? null : value,
      }));
    }

    if (value == "High" || value == "Medium" || value == "Low") {
      setPrioSelected((prev) => (prev === value ? null : value));
      setCheckboxes((prev) => ({
        ...prev,
        priotarization: prev["priotarization"] === value ? null : value,
      }));
    }
    if (value == "completed") {
      setCheckboxes((prev) => ({
        ...prev,
        completed: prev["completed"] === value ? null : value,
      }));
    }
  };

  const generateId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const onFinish = (values) => {
    const previousState = JSON.parse(localStorage.getItem("tasks")) || [];
    const preparedValues = {
      ...values,
      dates: [
        dayjs(values.dates[0]).format("DD/MM/YYYY"),
        dayjs(values.dates[1]).format("DD/MM/YYYY"),
      ],
      type: checkboxes.type,
      priotarization: checkboxes.priotarization,
      completed: checkboxes.completed,
      id: generateId(),
    };

    const nesto = previousState
      ? [...previousState, preparedValues]
      : [preparedValues];

    const stringified = JSON.stringify(nesto);

    localStorage.setItem("tasks", stringified);
    setRerenderTrigger((prev) => !prev);
  };

  const handleOnSearch = (value) => {
    setSearch(value);
  };

  const handleHeadColor = (item) => {
    let color;
    if (item.priotarization == "High") {
      color = "bg-red-500";
    }
    if (item.priotarization == "Medium") {
      color = "bg-orange-500";
    }
    if (item.priotarization == "Low") {
      color = "bg-yellow-500";
    }
    if (item.completed == "completed") {
      color = "bg-green-500";
    }
    return color;
  };

  const handleCompletedBttn = (completed) => {
    if (completed === "completed") {
      return "bg-red-600";
    } else if (completed === null) {
      return "bg-white";
    }
  };

  return (
    <Layout className="flex flex-col min-h-screen">
      <Header className="text-white text-2xl flex justify-center align-center h-fit m-0 pt-2 font-bold bg-gray-800">
        Student To-do List App
      </Header>
      <Content className="text-base flex justify-center bg-gray-800 w-full h-full">
        <div className="p-10 w-full h-full text-white pt-5 flex pr-0 pt-0 pb-0">
          {/* Create Task Form */}
          <div className="w-1/4 h-fit flex flex-col items-center bg-white rounded-2xl p-5 m-5">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              className="w-full h-full flex flex-col justify-between"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row gutter={[45, 45]} justify={"center"}>
                <Col span={16}>
                  <div className="text-center text-2xl tracking-wide font-bold">
                    New Task
                  </div>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl">Title:</span>}
                    name="title"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl">Description:</span>}
                    name="description"
                  >
                    <TextArea
                      minLength={3}
                      maxLength={100}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className="text-xl mb-2">Type:</span>}
                  >
                    <div className="flex justify-between w-full">
                      {["Personal", "Work", "Other"].map((option) => (
                        <Checkbox
                          key={option}
                          checked={typeSelected === option}
                          onChange={() => handleCheckboxChange(option)}
                          className="scale-[1.5] transform origin-left text-xs"
                        >
                          {option}
                        </Checkbox>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className=" text-xl mb-2">Complete:</span>}
                    className="flex justify-between"
                  >
                    <div>
                      <Checkbox
                        className="scale-[1.5] transform origin-left text-xs"
                        onChange={() => handleCheckboxChange("completed")}
                      >
                        Completed
                      </Checkbox>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={
                      <span className=" text-xl mb-2">Priotarization:</span>
                    }
                  >
                    <div className="flex justify-between w-full">
                      {["High", "Medium", "Low"].map((option) => (
                        <Checkbox
                          key={option}
                          checked={prioSelected === option}
                          onChange={() => handleCheckboxChange(option)}
                          className="scale-[1.5] transform origin-left    text-xs "
                        >
                          {option}
                        </Checkbox>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={<span className=" text-xl mb-2">Dates:</span>}
                    name="dates"
                  >
                    <RangePicker />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"end"}>
                <Col>
                  <Button className="mr-3" type="primary">
                    Reset fields
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Create
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          {/* End of Task Form */}
          {/* Search Filter */}
          <div className="pl-5 p-2 pb-10 pr-10 rounded-2xl w-full h-full overflow-y-auto">
            <div className="w-full px-5 hidden">+ Add Task</div>
            <div className="w-full mt-5 px-5">
              <div className="w-full flex flex">
                <Search
                  placeholder="Search..."
                  className="w-1/6"
                  enterButton
                  onSearch={handleOnSearch}
                />
                <div className="w-1/6 ml-5">
                  <Select
                    className="w-full"
                    placeholder="Select a category"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      { value: "high", label: "High" },
                      { value: "medium", label: "Medium" },
                      { value: "low", label: "Low" },
                      { value: "all", label: "All" },
                    ]}
                    value={priority}
                    onChange={(value) => {
                      setPriority(value);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* End of Search Filter */}
            {/* This can go into a separate component */}
            <div className="w-full grid grid-cols-5 gap-5 p-5 mt-5">
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
                      <p className="word-break w-4/5 pl-2">{item.title}</p>
                      <div className="w-1/5 flex justify-end">
                        <div
                          className={`p-2 ${handleCompletedBttn(
                            item.completed
                          )} w-fit h-fit rounded-full`}
                          onClick={() => {
                            const data =
                              JSON.parse(localStorage.getItem("tasks")) || [];
                            const updatedData = data.map((entity) => {
                              if (entity.id == item.id) {
                                return {
                                  ...entity,
                                  completed:
                                    entity.completed === "completed"
                                      ? null
                                      : "completed",
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
                        <p>{item.completed}</p>
                      </div>
                      <div className="w-full">
                        {item.dates[0]} - {item.dates[1]}
                      </div>
                      <div className="break-words whitespace-normal w-full">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* End of Task Cards */}
            </div>
          </div>
        </div>
      </Content>
      <Footer className="flex justify-center bg-gray-900 text-gray-300">
        <div className="text-xl flex justify-between w-full">
          <div className="mr-5">© Made by Zvoosh</div>
          <div className="flex">
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
