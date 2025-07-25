import {useState, type FormEvent} from 'react'
import FileUploader from '~/components/FileUploader';
import NavBar from '~/components/NavBar';
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import { convertPdfToImage } from '~/lib/pdfToImage';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';
const upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze  = async({ companyName, jobTitle, jobDescription, file }: {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {

        setIsProcessing(true);
        setStatusText('Uploading the file');
        const uploadFile = await fs.upload([file]);

        if(!uploadFile) return setStatusText('Error: Failed to upload file');
        setStatusText('Converting to image...');

        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText("Error: Failed to convert PDF to image");
        const uploadImage = await fs.upload([imageFile.file]);
        if(!uploadImage) return ("Failed to Upload Image")

        setStatusText("Ai is analyzing your cv");
        const uuid = generateUUID();

        const data = {
            id: uuid,
            resumePath: uploadFile.path,
            companyName,jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analyzing');

        const feedback = await ai.feedback(
            uploadFile.path,
            prepareInstructions({jobTitle, jobDescription})
        )
        if(!feedback) return setStatusText("Error Failed to analyze resume");

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content 
            : feedback.message.content[0].text;
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting ...');
        console.log(data);



    }

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get('Job Title') as string;
    const jobDescription = formData.get('Job-Description') as string;

    if(!file) return;

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription})

    }
  return (
    <main className='bg-cover'>
        <NavBar/>
        <section className='main-section'>
            <div className='page-heading py-16'>
                <h1>Smart feedback for your dream job</h1>
                {isProcessing ? (
                    <>
                    <h2>
                        {statusText}
                        <img src="/images/resume-scan.gif" className="w-full" />
                    </h2>
                    </>
                ): (
                    <h2> Drop your resume for an ATS score and improvment tips</h2>
                )}
                {!isProcessing && (
                    <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                        <div className="form-div">
                            <label htmlFor='company-name'>Company Name</label>
                            <input type='text' name='company-name' placeholder='Company Name' id='company-name'/>
                        </div>

                        <div className="form-div">
                            <label htmlFor='Job-Title'>Job Title</label>
                            <input type='text' name='job-title' placeholder='Job-Title' id='job-title'/>
                        </div>

                         <div className="form-div">
                            <label htmlFor='Job-Description'>Job Description</label>
                            <textarea rows={5} name='job-description' placeholder='Job-Description' id='job-title'/>
                        </div>

                         <div className="form-div">
                            <label htmlFor='uploader'>Upload Resume</label>
                           
                                <FileUploader onFileSelect={handleFileSelect} />

                           <button className='primary-button' type='submit'>
                            Analyze Resume
                           </button>
                        </div>
                    
                    </form>
                )}
            </div>
        </section>
    </main>
  )
}

export default upload
function async(arg0: { companyName: string; jobTitle: string; jobDescription: string; }) {
    throw new Error('Function not implemented.');
}

