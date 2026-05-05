import { FadeInSection } from "@/components/popUp/FadeInSection"





export default function InfoPage() {
    

    return (
        <div className="bg-blue-100 flex flex-col content-center items-center">
            <img className="h-48 w-48" src="/src/assets/Pictures/FimLogga.png"></img>
            <div className="mx-auto max-w-4xl text-h2 flex flex-row mb-10">
                <div>
                    <h1>Track your filament inventory, printing progress or chat about 3D printing over at the forum.
                        You can also browse the filament catalog for existing spools.</h1>
                </div>


                <div style={{borderLeft: "1px solid black" } }>
                    <p className="ml-4 mt-20">Filament was created as a project for an internship and is free for everyone to use.
                    It was made for tracking you inventory of filaments and make it easier to know what you have in stock.</p>
                </div>
            </div>


            <FadeInSection>
                <div className="mt-10 max-w-4xl mb-10">
                    <p style={{} }>You can easily track your filament usage with a simple interface that allows you to edit,
                        add or delete spools of your choice. You can also add a link to your favorite shopping website
                        to easily restock your inventory.</p>
                    <img style={{ border: "4px solid grey", width: "100%", marginTop: "10px" }} src="/src/assets/Pictures/spoolexample.png"></img>
                </div>
            </FadeInSection>

            <FadeInSection>
                <div className="mt-10 max-w-4xl mb-10">
                    <p>You can also track you print progress with real time update of all your active prints.</p>
                    <img style={{ border: "4px solid grey", width: "100%", marginTop: "10px" }} src="/src/assets/Pictures/activeprintsexample2.png"></img>
                </div>
            </FadeInSection>

        </div>
        
    )
}