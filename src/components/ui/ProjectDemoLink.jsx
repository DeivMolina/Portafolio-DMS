import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import ActionLink from './ActionLink';
import { projectDemoUrl } from '../../utils/contactLinks';

export default function ProjectDemoLink({ title, confidential = false }) {
  return (
    <ActionLink className="project-demo-link" variant="primary"
      href={projectDemoUrl(title, confidential)} target="_blank"
      aria-label={`Solicitar demo de ${title} por WhatsApp`}>
      <FaWhatsapp aria-hidden="true" focusable="false" />
      Solicitar demo
    </ActionLink>
  );
}
