import {useParams} from 'react-router-dom';
import {SectionView} from "@/pages/Section/SectionView.jsx";
import MockJSON from '@/assets/mock.json'
import {useState} from "react";

export function SingleBook() {
    const {sectionId} = useParams();

    const [sections] = useState(MockJSON.sections);

    const handleSectionClicked = (newSectionId) => {
        console.log(newSectionId);
        // const nextSection = sections.map((section) => {
        //     if (section.id === newSectionId) {
        //         section = newSectionId;
        //     }
        //     return section
        // });
        // setSection(nextSection);
    }

    return (
        <div >
            <SectionView
                key={sectionId}
                section={sections[sectionId - 1]}
                handleSectionClicked={() => handleSectionClicked(sectionId)}
            />
        </div>
    );
}

