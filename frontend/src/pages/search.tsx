import { useAutoAnimate } from "@formkit/auto-animate/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Card, TextInput } from "flowbite-react";
import { GetStaticProps } from "next";
import { useState } from "react";

type Props = {
  data: {
    users: {
      _id: string,
      name: string,
      email: string,
    }[],
  }
}
export default function Search({ data }: Props) {
  const [animRef, _] = useAutoAnimate()
  const [filteredData, setFilteredData] = useState(data.users);
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col px-4">
      <div className="font-bold text-2xl">Search Users</div>
      <div className="text-neutral-800">These are all the users available</div>
      <TextInput
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setFilteredData(
            data.users.filter((user) =>
              user.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
          );
        }}
        placeholder="Search for a user"
        className="mt-4"
        addon={<FontAwesomeIcon icon={faSearch} />}
      />
      <div className="flex flex-col md:flex-row gap-4 mt-4 w-full flex-wrap justify-center" ref={animRef}>
        {filteredData.map((user) => (
          <Card
            className="max-w-md"
            key={user._id}
          >
            <div className="font-bold text-xl break-words">{user.name}</div>
            <div className="text-neutral-800 break-words">{user.email}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await axios.get(`${process.env.BACKENDURL}/allUsers`);

  return {
    props: { data },
    revalidate: 120,
  };
}
