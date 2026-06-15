package br.com.ufal.gradua.infra;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.EntityManager;
import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.auth.MonitorModel;
import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.repositories.UserRepository;
import br.com.ufal.gradua.repositories.StudentRepository;
import br.com.ufal.gradua.repositories.ProfessorRepository;
import br.com.ufal.gradua.repositories.SubjectRepository;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.MonitorRepository;
import br.com.ufal.gradua.repositories.MonitorSessionRepository;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
import br.com.ufal.gradua.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = false)
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSectionRepository classSectionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MonitorRepository monitorRepository;
    private final MonitorSessionRepository monitorSessionRepository;
    private final ForumTopicRepository forumTopicRepository;
    private final ForumCommentRepository forumCommentRepository;
    private final NotificationRepository notificationRepository;
    private final br.com.ufal.gradua.repositories.AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager em;

    @Override
    public void run(String... args) throws Exception {
        try {
            log.info("Iniciando DataSeeder (síncrono)...");

            // ADMIN (idempotente)
            String adminCpf = "00000000000";
            if (userRepository.findByCpfOrPassport(adminCpf).isEmpty()) {
                log.info("Criando conta de ADMIN padrão para testes...");
                UserModel admin = new UserModel();
                admin.setFirstName("Admin");
                admin.setLastName("Teste");
                admin.setEmail("admin@gradua.ufal.br");
                admin.setCpf(adminCpf);
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setIsForeigner(false);
                userRepository.save(admin);
                log.info("Conta ADMIN criada: CPF={} / Senha={}", adminCpf, "admin123");
            } else {
                log.info("Conta ADMIN padrão já existe.");
            }

            // -------------------------
            // Subjects (idempotente)
            // -------------------------
            class SubjectDef { String code; String name; int credits; SubjectDef(String c,String n,int cr){code=c;name=n;credits=cr;} }
            SubjectDef[] subjects = new SubjectDef[] {
                new SubjectDef("PROG1","Programação 1",80),
                new SubjectDef("PROG2","Programação 2",80),
                new SubjectDef("TDC","Teoria da Computação",60),
                new SubjectDef("BD","Banco de Dados",60),
                new SubjectDef("CALC","Cálculo",80),
                new SubjectDef("SO","Sistemas Operacionais",60)
            };

            java.util.Map<String, SubjectModel> createdSubjects = new java.util.HashMap<>();
            for (SubjectDef sd : subjects) {
                java.util.Optional<SubjectModel> existing = subjectRepository.findAll().stream()
                    .filter(s -> sd.code.equals(s.getCode()))
                    .findFirst();
                if (existing.isPresent()) {
                    createdSubjects.put(sd.code, existing.get());
                } else {
                    SubjectModel m = new SubjectModel();
                    m.setCode(sd.code);
                    m.setName(sd.name);
                    m.setCreditHours(sd.credits);
                    subjectRepository.saveAndFlush(m);
                    createdSubjects.put(sd.code, m);
                    log.info("Subject created: {} - {}", sd.code, sd.name);
                }
            }

            // -------------------------
            // Professors (idempotente)
            // -------------------------
            class ProfDef { String cpf; String email; String first; String last; String pass; ProfDef(String cpf,String email,String f,String l,String p){this.cpf=cpf;this.email=email;this.first=f;this.last=l;this.pass=p;} }
            ProfDef[] profs = new ProfDef[] {
                new ProfDef("22222222222","maria.santos@gradua.ufal.br","Maria","Santos","prof123"),
                new ProfDef("33333333333","joao.pereira@gradua.ufal.br","João","Pereira","prof123"),
                new ProfDef("44444444444","ana.lima@gradua.ufal.br","Ana","Lima","prof123")
            };

            java.util.List<ProfessorModel> createdProfessors = new java.util.ArrayList<>();
            for (ProfDef pd : profs) {
                java.util.Optional<UserModel> uopt = userRepository.findByCpfOrPassport(pd.cpf);
                UserModel user;
                if (uopt.isPresent()) {
                    user = uopt.get();
                } else {
                    user = new UserModel();
                    user.setFirstName(pd.first);
                    user.setLastName(pd.last);
                    user.setEmail(pd.email);
                    user.setCpf(pd.cpf);
                    user.setPasswordHash(passwordEncoder.encode(pd.pass));
                    user.setRole("PROFESSOR");
                    user.setIsForeigner(false);
                    userRepository.save(user);
                }

                if (user.getProfessor() == null) {
                    ProfessorModel pm = new ProfessorModel();
                    pm.setProfessorID(java.util.UUID.randomUUID());
                    pm.setUser(user);
                    professorRepository.save(pm);
                    // do not set user.professor here to avoid transient/detached reference cycles
                    createdProfessors.add(pm);
                } else {
                    createdProfessors.add(user.getProfessor());
                }
            }

            // -------------------------
            // Students (idempotente)
            // -------------------------
            class StudDef { String cpf; String email; String first; String last; String pass; String enrollment; int term; BigDecimal ira; StudDef(String cpf,String email,String f,String l,String p,String e,int t,BigDecimal i){this.cpf=cpf;this.email=email;this.first=f;this.last=l;this.pass=p;this.enrollment=e;this.term=t;this.ira=i;} }
            StudDef[] studs = new StudDef[] {
                new StudDef("11111111111","tester@gradua.ufal.br","Tester","Silva","student123","2026001",4,new BigDecimal("7.50")),
                new StudDef("55555555555","lucas.moura@gradua.ufal.br","Lucas","Moura","student123","2026002",2,new BigDecimal("8.10")),
                new StudDef("66666666666","mariana.ramos@gradua.ufal.br","Mariana","Ramos","student123","2026003",6,new BigDecimal("6.90")),
                new StudDef("77777777777","pedro.alves@gradua.ufal.br","Pedro","Alves","student123","2026004",1,new BigDecimal("9.00"))
            };

            java.util.List<StudentModel> createdStudents = new java.util.ArrayList<>();
            for (StudDef sd : studs) {
                java.util.Optional<UserModel> uopt = userRepository.findByCpfOrPassport(sd.cpf);
                UserModel user;
                if (uopt.isPresent()) {
                    user = uopt.get();
                } else {
                    user = new UserModel();
                    user.setFirstName(sd.first);
                    user.setLastName(sd.last);
                    user.setEmail(sd.email);
                    user.setCpf(sd.cpf);
                    user.setPasswordHash(passwordEncoder.encode(sd.pass));
                    user.setRole("USER");
                    user.setIsForeigner(false);
                    userRepository.save(user);
                }

                if (user.getStudent() == null) {
                    StudentModel sm = new StudentModel();
                    sm.setStudentID(java.util.UUID.randomUUID());
                    sm.setEnrollmentNumber(sd.enrollment);
                    sm.setCurrentTerm(sd.term);
                    sm.setIra(sd.ira);
                    sm.setMandatoryHours(180);
                    sm.setElectiveHours(20);
                    sm.setComplementaryHours(10);
                    sm.setTotalHours(210);
                    sm.setUser(user);
                    studentRepository.saveAndFlush(sm);
                    // do not set user.student here to avoid transient reference problems during flush
                    createdStudents.add(sm);
                } else {
                    createdStudents.add(user.getStudent());
                }
            }

            // -------------------------
            // Class sections and enrollments
            // -------------------------
            java.util.List<ClassSectionModel> createdClasses = new java.util.ArrayList<>();
            // create a class per subject assigned to a professor
            int pi = 0;
            for (String code : createdSubjects.keySet()) {
                SubjectModel subj = createdSubjects.get(code);
                ProfessorModel prof = createdProfessors.get(pi % createdProfessors.size());
                pi++;
                // check existence
                java.util.Optional<ClassSectionModel> copt = classSectionRepository.findAll().stream()
                    .filter(c -> c.getSubject()!=null && c.getSubject().getCode().equals(code) && "2026.1".equals(c.getAcademicTerm()))
                    .findFirst();
                ClassSectionModel cls;
                if (copt.isPresent()) {
                    cls = copt.get();
                } else {
                    cls = new ClassSectionModel();
                    // let JPA generate classId
                    cls.setSubject(subj);
                    cls.setProfessor(prof);
                    cls.setAcademicTerm("2026.1");
                    classSectionRepository.saveAndFlush(cls);
                }
                createdClasses.add(cls);
            }

            // enroll students in first 3 classes
            for (int i = 0; i < createdStudents.size(); i++) {
                StudentModel s = createdStudents.get(i);
                for (int j = 0; j < Math.min(3, createdClasses.size()); j++) {
                    ClassSectionModel cls = createdClasses.get(j);
                    boolean already = enrollmentRepository.findAll().stream()
                        .anyMatch(e -> e.getStudent()!=null && e.getStudent().getStudentID().equals(s.getStudentID())
                            && e.getClassSection()!=null && e.getClassSection().getClassId().equals(cls.getClassId()));
                    if (!already) {
                        EnrollmentModel em = new EnrollmentModel();
                        // let JPA generate enrollment id
                        em.setStudent(s);
                        em.setClassSection(cls);
                        em.setStatus(null);
                        em.setAbsences(0);
                        enrollmentRepository.saveAndFlush(em);
                    }
                }
            }

            // -------------------------
            // Monitors, sessions and notifications
            // -------------------------
            // make first student a monitor for first class
            if (!createdStudents.isEmpty() && !createdClasses.isEmpty()) {
                StudentModel s = createdStudents.get(0);
                MonitorModel mon = monitorRepository.findAll().stream()
                    .filter(mo -> mo.getStudent()!=null && mo.getStudent().getStudentID().equals(s.getStudentID()))
                    .findFirst().orElse(null);
                if (mon==null) {
                    mon = new MonitorModel();
                    // let JPA generate monitor id
                    mon.setScholarshipType("BOLSISTA");
                    mon.setStudent(s);
                    monitorRepository.saveAndFlush(mon);
                }

                // Create a few sessions
                for (int k=0;k<2;k++) {
                    MonitorSessionModel ms = new MonitorSessionModel();
                    // let JPA generate session id
                    ms.setMonitor(mon);
                    ms.setClassSection(createdClasses.get(0));
                    ms.setTopic(k==0?"Plantão de dúvidas - Programação 2":"Revisão - Programação 1");
                    ms.setDate(LocalDate.now().plusDays(k));
                    ms.setStartTime(LocalTime.of(15+k,0));
                    ms.setEndTime(LocalTime.of(16+k,0));
                    ms.setLocation("Sala " + (100+k));
                    ms.setMeetingLink(k==0?null:"https://meet.example.com/session"+k);
                    monitorSessionRepository.saveAndFlush(ms);

                    // notification to the monitor student
                    NotificationModel nm = new NotificationModel();
                    // let JPA generate notification id
                    nm.setRecipientUser(s.getUser());
                    nm.setMonitorSession(ms);
                    nm.setMessage("Monitoria: " + ms.getTopic() + " em " + ms.getLocation());
                    nm.setIsRead(false);
                    nm.setCreatedAt(java.time.LocalDateTime.now());
                    notificationRepository.saveAndFlush(nm);
                }
            }

            // -------------------------
            // Announcements
            // -------------------------
            if (!createdClasses.isEmpty()) {
                // create an announcement for the first class (idempotent)
                br.com.ufal.gradua.models.forum.AnnouncementModel ann = new br.com.ufal.gradua.models.forum.AnnouncementModel();
                // let JPA generate announcement id
                ann.setAuthor(createdClasses.get(0).getProfessor().getUser());
                ann.setClassSection(createdClasses.get(0));
                ann.setTitle("Aviso: alteração de sala");
                ann.setContent("A próxima aula será na sala 202.");
                ann.setPublishDate(java.time.LocalDateTime.now());
                // simple dedupe: check existing announcements with same title
                boolean existsAnn = announcementRepository.findAll().stream()
                    .anyMatch(a -> a.getTitle()!=null && a.getTitle().equals(ann.getTitle())
                        && a.getClassSection()!=null && a.getClassSection().getClassId().equals(ann.getClassSection().getClassId()));
                if (!existsAnn) {
                    announcementRepository.saveAndFlush(ann);
                }
                // also create a forum AVISO for class
                ForumTopicModel aviso = new ForumTopicModel();
                // let JPA generate topic id
                aviso.setAuthor(createdClasses.get(0).getProfessor().getUser());
                aviso.setTitle("Aviso de turma: " + createdClasses.get(0).getSubject().getCode());
                aviso.setContent("Aula transferida para sala 202 nesta semana.");
                aviso.setCreationDate(java.time.LocalDateTime.now());
                aviso.setType("AVISO");
                aviso.setIsEdited(false);
                aviso.setVoteScore(null);
                aviso.setCommentCount(0);
                forumTopicRepository.saveAndFlush(aviso);
            }

            // -------------------------
            // Forum extra topics and comments
            // -------------------------
            // add a general question and a reply
            ForumTopicModel q = new ForumTopicModel();
            // let JPA generate topic id
            q.setAuthor(createdStudents.get(0).getUser());
            q.setTitle("Dúvida sobre avaliação final");
            q.setContent("Alguém sabe como será a prova final?");
            q.setCreationDate(java.time.LocalDateTime.now().minusDays(1));
            q.setType("DUVIDA");
            q.setIsEdited(false);
            q.setVoteScore(0);
            q.setCommentCount(0);
            forumTopicRepository.saveAndFlush(q);

            ForumCommentModel ans = new ForumCommentModel();
            // let JPA generate comment id
            ans.setTopic(q);
            ans.setAuthor(createdProfessors.get(0).getUser());
            ans.setContent("A prova terá 3 questões discursivas e 2 de múltipla escolha.");
            ans.setCreationDate(java.time.LocalDateTime.now().minusHours(20));
            forumCommentRepository.saveAndFlush(ans);

            q.setCommentCount(1);
            forumTopicRepository.saveAndFlush(q);

            log.info("DataSeeder finalizado com sucesso.");
        } catch (Exception ex) {
            // Log the error but do not rethrow so the application can continue running.
            // This mirrors the previous behavior before we added transactional rollback.
            log.warn("Erro inesperado no DataSeeder: {}", ex.getMessage());
            log.debug("Stacktrace do erro no DataSeeder:", ex);
        }
    }
}
