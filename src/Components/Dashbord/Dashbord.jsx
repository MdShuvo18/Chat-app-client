const Dashboard = () => {
    const contacts = [
      {
        name: 'John',
        status: 'active',
        img: "https://i.ibb.co/kqSnnFn/download-1.jpg"
      },
      {
        name: 'Larry',
        status: 'active',
        img: "https://i.ibb.co/kqSnnFn/download-1.jpg"
      },
      {
        name: 'Marry',
        status: 'active',
        img: "https://i.ibb.co/kqSnnFn/download-1.jpg"
      },
      {
        name: 'Christofer',
        status: 'active',
        img: "https://i.ibb.co/kqSnnFn/download-1.jpg"
      },
      {
        name: 'Alex',
        status: 'active',
        img: "https://i.ibb.co/kqSnnFn/download-1.jpg"
      },
    ];
  
    return (
      <div className="w-screen flex">
        <div className="w-[25%] bg-white border border-black h-screen">
          <div className="flex justify-center items-center p-14">
            <img
              src="https://i.ibb.co/kqSnnFn/download-1.jpg"
              alt=""
              width={75}
              height={75}
              className="rounded-full"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold">Miss Dev</h1>
              <h1 className="text-lg font-medium">My Account</h1>
            </div>
          </div>
          <hr />
          <div className="p-8">
            <div className="text-lg text-green-500 font-semibold">Messages</div>
            <div>
              {contacts.map(({ name, status, img }) => {
                return (
                  <div key={name} className="flex items-center p-4">
                    <img
                      src={img}
                      alt={name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <h1 className="text-lg font-semibold">{name}</h1>
                      <h1 className="text-sm font-medium">{status}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-[50%] border border-black h-screen"></div>
        <div className="w-[25%] border border-black h-screen"></div>
      </div>
    );
  };
  
  export default Dashboard;
  